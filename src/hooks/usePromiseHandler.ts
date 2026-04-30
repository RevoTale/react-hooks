import { useCallback, useMemo, useRef, useState } from 'react'
import useVariable from './useVariable'

export type PromiseHandlerError = string | Error

type StateIdle = {
	readonly error: null
	readonly loading: false
	readonly promise: null
	readonly result: null
}

type StateError<T> = {
	readonly error: PromiseHandlerError
	readonly loading: false
	readonly promise: Promise<T>
	readonly result: null
}

type StateOk<T> = {
	readonly error: null
	readonly loading: false
	readonly promise: Promise<T>
	readonly result: T
}

type StateLoading<T> = {
	readonly error: null
	readonly loading: true
	readonly promise: Promise<T>
	readonly result: null
}

export type PromiseState<T> =
	| StateIdle
	| StateError<T>
	| StateOk<T>
	| StateLoading<T>

export type PromiseHandlerOptions<T> = {
	readonly onCompleted?: (data: T) => void
	readonly onError?: (error: PromiseHandlerError) => void
}

export type PromiseHandlerResult<T> = PromiseState<T> & {
	readonly getPromise: () => Promise<T> | null
	readonly setPromise: (
		promise: Promise<T> | null,
		options?: PromiseHandlerOptions<T>,
	) => void
}

const defaultState: StateIdle = {
	error: null,
	loading: false,
	promise: null,
	result: null,
}

const normalizeError = (error: unknown): PromiseHandlerError => {
	if (error instanceof Error) {
		return error
	}

	if (typeof error === 'string') {
		return error
	}

	console.error('Unexpected promise error format', error)
	return 'Unexpected error format'
}

const usePromiseHandler = <T>(
	options?: PromiseHandlerOptions<T>,
): PromiseHandlerResult<T> => {
	const [state, setState] = useState<PromiseState<T>>(defaultState)
	const promiseRef = useRef<Promise<T> | null>(null)
	const optionsRef = useVariable(options)

	const setPromise = useCallback(
		(promise: Promise<T> | null, contextOptions?: PromiseHandlerOptions<T>) => {
			promiseRef.current = promise

			if (promise === null) {
				setState(defaultState)
				return
			}

			setState({
				...defaultState,
				loading: true,
				promise,
			})

			const isActualPromise = (): boolean => promise === promiseRef.current

			promise
				.then((result) => {
					if (!isActualPromise()) {
						return
					}

					optionsRef.current?.onCompleted?.(result)
					contextOptions?.onCompleted?.(result)

					setState({
						error: null,
						loading: false,
						promise,
						result,
					})
				})
				.catch((error: unknown) => {
					if (!isActualPromise()) {
						return
					}

					const normalizedError = normalizeError(error)
					optionsRef.current?.onError?.(normalizedError)
					contextOptions?.onError?.(normalizedError)

					setState({
						error: normalizedError,
						loading: false,
						promise,
						result: null,
					})
				})
		},
		[optionsRef],
	)

	return useMemo<PromiseHandlerResult<T>>(
		() => ({
			...state,
			getPromise: () => promiseRef.current,
			setPromise,
		}),
		[state, setPromise],
	)
}

export default usePromiseHandler
