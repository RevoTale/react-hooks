import { useEffect, useRef } from 'react'
import useVariable from './useVariable'

type OnceCallback = () => void

const useOnce = (callback: OnceCallback): void => {
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
