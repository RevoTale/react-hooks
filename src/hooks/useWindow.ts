'use client'

import { useEffect, useState } from 'react'

const useWindow = (): Window | null => {
	const [currentWindow, setCurrentWindow] = useState<Window | null>(null)

	useEffect(() => {
		setCurrentWindow(window)
	}, [])

	return currentWindow
}

export default useWindow
