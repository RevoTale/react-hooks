import { useEffect, useRef } from 'react'
import useVariable from './useVariable'

const useOnce = (callback: () => void): void => {
	const triggered = useRef(false)
	const callbackRef = useVariable(callback)

	useEffect(() => {
		if (!triggered.current) {
			triggered.current = true
			callbackRef.current()
		}
	}, [callbackRef])
}

export default useOnce
