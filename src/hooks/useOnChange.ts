import { type EffectCallback, useEffect } from 'react'
import usePrevious from './usePrevious'
import useVariable from './useVariable'

const useOnChange = <T>(
	callback: (previous: T) => ReturnType<EffectCallback>,
	value: T,
): void => {
	const callbackRef = useVariable(callback)
	const previous = usePrevious(value)

	useEffect(() => {
		if (previous !== value) {
			return callbackRef.current(previous)
		}

		return undefined
	}, [callbackRef, previous, value])
}

export default useOnChange
