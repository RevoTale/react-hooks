import { type KeyboardEventHandler, useCallback } from 'react'
import useVariable from './useVariable'

const useOnEnterDown = <T>(
	callback: KeyboardEventHandler<T>,
): KeyboardEventHandler<T> => {
	const callbackRef = useVariable(callback)

	return useCallback(
		(event) => {
			if (event.key === 'Enter') {
				callbackRef.current(event)
			}
		},
		[callbackRef],
	)
}

export default useOnEnterDown
