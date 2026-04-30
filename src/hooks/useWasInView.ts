import { type RefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import useBool from './useBool'
import useVariable from './useVariable'
import useWindow from './useWindow'

type WindowWithIntersectionObserver = Window & {
	readonly IntersectionObserver: typeof IntersectionObserver
}

export interface WasInViewOptions extends IntersectionObserverInit {
	readonly fallbackInView?: boolean
	readonly onInView?: (element: HTMLElement) => void
	readonly ssrInView?: boolean
}

export type WasInViewResult<T extends HTMLElement> = [
	RefObject<T | null>,
	boolean,
]

const useWasInView = <T extends HTMLElement>({
	fallbackInView = false,
	onInView,
	root,
	rootMargin,
	ssrInView = false,
	threshold,
}: WasInViewOptions = {}): WasInViewResult<T> => {
	const currentWindow = useWindow()
	const IntersectionObserverConstructor = useMemo(
		() =>
			currentWindow && 'IntersectionObserver' in currentWindow
				? (currentWindow as WindowWithIntersectionObserver).IntersectionObserver
				: null,
		[currentWindow],
	)
	const intersectionSupported = Boolean(IntersectionObserverConstructor)
	const [wasVisible, setWasVisible] = useBool(
		currentWindow
			? intersectionSupported
				? false
				: fallbackInView
			: ssrInView,
	)
	const onInViewRef = useVariable(onInView)
	const ref = useRef<T>(null)

	const handleVisible = useCallback(
		(element: HTMLElement) => {
			onInViewRef.current?.(element)
			setWasVisible(true)
		},
		[onInViewRef, setWasVisible],
	)

	useEffect(() => {
		const element = ref.current

		if (!intersectionSupported && fallbackInView && element) {
			handleVisible(element)
		}
	}, [fallbackInView, handleVisible, intersectionSupported])

	useEffect(() => {
		const element = ref.current

		if (!element || wasVisible || !IntersectionObserverConstructor) {
			return undefined
		}

		const observerOptions: IntersectionObserverInit = {}
		if (root !== undefined) {
			observerOptions.root = root
		}
		if (rootMargin !== undefined) {
			observerOptions.rootMargin = rootMargin
		}
		if (threshold !== undefined) {
			observerOptions.threshold = threshold
		}

		const observer = new IntersectionObserverConstructor(
			(entries: Array<IntersectionObserverEntry>) => {
				const visible = entries.some(
					(entry) => entry.isIntersecting || entry.isIntersecting === undefined,
				)

				if (visible) {
					handleVisible(element)
					observer.unobserve(element)
				}
			},
			observerOptions,
		)

		observer.observe(element)

		return () => {
			observer.unobserve(element)
		}
	}, [
		IntersectionObserverConstructor,
		handleVisible,
		root,
		rootMargin,
		threshold,
		wasVisible,
	])

	return [ref, wasVisible]
}

export default useWasInView
