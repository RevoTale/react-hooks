import { useCallback, useEffect, useState } from 'react'
import useWindow from './useWindow'

export interface WindowSize {
	readonly width: number
	readonly height: number
}

const emptyWindowSize: WindowSize = {
	width: 0,
	height: 0,
}

const useWindowSize = (): WindowSize => {
	const currentWindow = useWindow()
	const getWindowSize = useCallback((): WindowSize => {
		if (!currentWindow) {
			return emptyWindowSize
		}

		return {
			width: currentWindow.innerWidth,
			height: currentWindow.innerHeight,
		}
	}, [currentWindow])
	const [windowSize, setWindowSize] = useState<WindowSize | null>(null)

	useEffect(() => {
		if (!currentWindow) {
			return undefined
		}

		const listener = () => {
			setWindowSize(getWindowSize())
		}

		currentWindow.addEventListener('resize', listener)

		return () => {
			currentWindow.removeEventListener('resize', listener)
		}
	}, [currentWindow, getWindowSize])

	return windowSize ?? getWindowSize()
}

export default useWindowSize
