import { describe, expect, mock, test } from 'bun:test'
import { render, renderHook } from '@testing-library/react'
import { act } from 'react'
import {
	PromiseHandlerState,
	useBool,
	useCallFalse,
	useCallTrue,
	useOnChange,
	useOnEnterDown,
	usePromiseHandler,
	usePromiseState,
	useToggle,
	useVariable,
	useWasInView,
	useWindow,
	useWindowHost,
	useWindowOrigin,
	useWindowSize,
} from '../src'

const deferred = <T,>() => {
	let resolve: (value: T) => void
	let reject: (reason: unknown) => void
	const promise = new Promise<T>((promiseResolve, promiseReject) => {
		resolve = promiseResolve
		reject = promiseReject
	})

	return {
		promise,
		reject: (reason: unknown) => reject(reason),
		resolve: (value: T) => resolve(value),
	}
}

const setWindowIntersectionObserver = (
	value: typeof IntersectionObserver | undefined,
): (() => void) => {
	const descriptor = Object.getOwnPropertyDescriptor(
		window,
		'IntersectionObserver',
	)

	if (value === undefined) {
		Reflect.deleteProperty(window, 'IntersectionObserver')
	} else {
		Object.defineProperty(window, 'IntersectionObserver', {
			configurable: true,
			value,
		})
	}

	return () => {
		if (descriptor) {
			Object.defineProperty(window, 'IntersectionObserver', descriptor)
		} else {
			Reflect.deleteProperty(window, 'IntersectionObserver')
		}
	}
}

describe('state helpers', () => {
	test('useBool, useCallTrue, useCallFalse, and useToggle compose with boolean state', () => {
		const view = renderHook(() => {
			const [value, setValue] = useBool(false)
			return {
				hide: useCallFalse(setValue),
				show: useCallTrue(setValue),
				toggle: useToggle(setValue),
				value,
			}
		})

		expect(view.result.current.value).toBe(false)

		act(() => view.result.current.show())
		expect(view.result.current.value).toBe(true)

		act(() => view.result.current.toggle())
		expect(view.result.current.value).toBe(false)

		act(() => view.result.current.hide())
		expect(view.result.current.value).toBe(false)
	})

	test('useVariable keeps a stable ref with the latest value', () => {
		let value = 'initial'
		const view = renderHook(() => useVariable(value))
		const initialRef = view.result.current

		value = 'next'
		view.rerender()

		expect(view.result.current).toBe(initialRef)
		expect(view.result.current.current).toBe('next')
	})
})

describe('effect helpers', () => {
	test('useOnChange skips the initial render and passes the previous value', () => {
		const changes: Array<string> = []
		let value = 'first'
		const view = renderHook(() =>
			useOnChange((previous) => {
				changes.push(previous)
			}, value),
		)

		expect(changes).toEqual([])

		value = 'second'
		view.rerender()

		expect(changes).toEqual(['first'])
	})

	test('useOnEnterDown only calls the handler for Enter keydown events', () => {
		const handler = mock()
		const view = renderHook(() => useOnEnterDown(handler))

		act(() => {
			view.result.current(
				new KeyboardEvent('keydown', { key: 'Escape' }) as never,
			)
			view.result.current(
				new KeyboardEvent('keydown', { key: 'Enter' }) as never,
			)
		})

		expect(handler).toHaveBeenCalledTimes(1)
	})
})

describe('promise helpers', () => {
	test('usePromiseHandler ignores stale promises and exposes a derived state', async () => {
		const completed: Array<number> = []
		const view = renderHook(() => {
			const handler = usePromiseHandler<number>({
				onCompleted: (result) => completed.push(result),
			})

			return {
				handler,
				state: usePromiseState(handler),
			}
		})

		const first = deferred<number>()
		const second = deferred<number>()

		act(() => {
			view.result.current.handler.setPromise(first.promise)
			view.result.current.handler.setPromise(second.promise)
		})

		expect(view.result.current.state).toBe(PromiseHandlerState.Loading)

		await act(async () => {
			first.resolve(1)
			await first.promise
		})

		expect(view.result.current.state).toBe(PromiseHandlerState.Loading)
		expect(completed).toEqual([])

		await act(async () => {
			second.resolve(2)
			await second.promise
		})

		expect(view.result.current.handler.result).toBe(2)
		expect(view.result.current.state).toBe(PromiseHandlerState.Ok)
		expect(completed).toEqual([2])
	})
})

describe('window helpers', () => {
	test('useWindow exposes the browser window after mount', () => {
		const view = renderHook(() => useWindow())

		expect(view.result.current).toBe(window)
	})

	test('useWindowHost and useWindowOrigin derive location values after mount', () => {
		const view = renderHook(() => ({
			host: useWindowHost(),
			origin: useWindowOrigin(),
		}))

		expect(view.result.current).toEqual({
			host: 'example.test',
			origin: 'https://example.test',
		})
	})

	test('useWasInView observes instead of fallback when IntersectionObserver exists', () => {
		const observe = mock()
		const unobserve = mock()

		class MockIntersectionObserver {
			observe = observe
			unobserve = unobserve
		}

		const restoreIntersectionObserver = setWindowIntersectionObserver(
			MockIntersectionObserver as typeof IntersectionObserver,
		)
		let wasInView = true

		const Probe = () => {
			const [ref, visible] = useWasInView<HTMLDivElement>({
				fallbackInView: true,
			})
			wasInView = visible

			return <div ref={ref} />
		}

		try {
			const view = render(<Probe />)
			const element = view.container.firstElementChild

			expect(element).toBeInstanceOf(HTMLElement)
			expect(wasInView).toBe(false)
			expect(observe).toHaveBeenCalledTimes(1)
			expect(observe.mock.calls[0]?.[0]).toBe(element)

			view.unmount()
			expect(unobserve).toHaveBeenCalledTimes(1)
			expect(unobserve.mock.calls[0]?.[0]).toBe(element)
		} finally {
			restoreIntersectionObserver()
		}
	})

	test('useWasInView uses fallback after mount when IntersectionObserver is missing', () => {
		const restoreIntersectionObserver = setWindowIntersectionObserver(undefined)
		let wasInView = false

		const Probe = () => {
			const [ref, visible] = useWasInView<HTMLDivElement>({
				fallbackInView: true,
			})
			wasInView = visible

			return <div ref={ref} />
		}

		try {
			render(<Probe />)

			expect(wasInView).toBe(true)
		} finally {
			restoreIntersectionObserver()
		}
	})

	test('useWindowSize reads and updates browser dimensions', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: 800,
		})
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 600,
		})

		const view = renderHook(() => useWindowSize())

		expect(view.result.current).toEqual({ width: 800, height: 600 })

		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: 1024,
		})
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 768,
		})

		act(() => {
			window.dispatchEvent(new Event('resize'))
		})

		expect(view.result.current).toEqual({ width: 1024, height: 768 })
	})
})
