import { describe, expect, mock, test } from 'bun:test'
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
	useWindowSize,
} from '../src'
import { renderHook } from './renderHook'

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

		expect(view.result.value).toBe(false)

		act(() => view.result.show())
		expect(view.result.value).toBe(true)

		act(() => view.result.toggle())
		expect(view.result.value).toBe(false)

		act(() => view.result.hide())
		expect(view.result.value).toBe(false)

		view.unmount()
	})

	test('useVariable keeps a stable ref with the latest value', () => {
		let value = 'initial'
		const view = renderHook(() => useVariable(value))
		const initialRef = view.result

		value = 'next'
		view.rerender()

		expect(view.result).toBe(initialRef)
		expect(view.result.current).toBe('next')

		view.unmount()
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

		view.unmount()
	})

	test('useOnEnterDown only calls the handler for Enter keydown events', () => {
		const handler = mock()
		const view = renderHook(() => useOnEnterDown(handler))

		act(() => {
			view.result(new KeyboardEvent('keydown', { key: 'Escape' }) as never)
			view.result(new KeyboardEvent('keydown', { key: 'Enter' }) as never)
		})

		expect(handler).toHaveBeenCalledTimes(1)

		view.unmount()
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
			view.result.handler.setPromise(first.promise)
			view.result.handler.setPromise(second.promise)
		})

		expect(view.result.state).toBe(PromiseHandlerState.Loading)

		await act(async () => {
			first.resolve(1)
			await first.promise
		})

		expect(view.result.state).toBe(PromiseHandlerState.Loading)
		expect(completed).toEqual([])

		await act(async () => {
			second.resolve(2)
			await second.promise
		})

		expect(view.result.handler.result).toBe(2)
		expect(view.result.state).toBe(PromiseHandlerState.Ok)
		expect(completed).toEqual([2])

		view.unmount()
	})
})

describe('window helpers', () => {
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

		expect(view.result).toEqual({ width: 800, height: 600 })

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

		expect(view.result).toEqual({ width: 1024, height: 768 })

		view.unmount()
	})
})
