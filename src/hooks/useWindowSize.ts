'use client'

import { useSyncExternalStore } from 'react'

export interface WindowSize {
	readonly width: number
	readonly height: number
}

const emptyWindowSize: WindowSize = {
	width: 0,
	height: 0,
}

let cachedWindowSize = emptyWindowSize

const getWindowSize = (): WindowSize => {
	const width = window.innerWidth
	const height = window.innerHeight

	if (cachedWindowSize.width === width && cachedWindowSize.height === height) {
		return cachedWindowSize
	}

	cachedWindowSize = { width, height }
	return cachedWindowSize
}

const getServerWindowSize = (): WindowSize => emptyWindowSize

const subscribeToWindowSize = (callback: () => void): (() => void) => {
	window.addEventListener('resize', callback)

	return () => {
		window.removeEventListener('resize', callback)
	}
}

const useWindowSize = (): WindowSize => {
	return useSyncExternalStore(
		subscribeToWindowSize,
		getWindowSize,
		getServerWindowSize,
	)
}

export default useWindowSize
