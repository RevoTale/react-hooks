import { act } from 'react'
import { createRoot } from 'react-dom/client'

export type RenderedHook<T> = {
	readonly result: T
	readonly rerender: () => void
	readonly unmount: () => void
}

export const renderHook = <T,>(callback: () => T): RenderedHook<T> => {
	let hasRendered = false
	let result: T
	const container = document.createElement('div')
	const root = createRoot(container)

	document.body.append(container)

	const Probe = () => {
		result = callback()
		hasRendered = true
		return null
	}

	const render = () => {
		act(() => {
			root.render(<Probe />)
		})
	}

	render()

	return {
		get result() {
			if (!hasRendered) {
				throw new Error('Hook result was read before render')
			}

			return result
		},
		rerender: render,
		unmount: () => {
			act(() => {
				root.unmount()
			})
			container.remove()
		},
	}
}
