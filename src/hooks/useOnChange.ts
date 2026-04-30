import { type EffectCallback, useEffect } from 'react'
import usePrevious from './usePrevious'
import useVariable from './useVariable'

type ChangeCallback<T> = (previous: T) => ReturnType<EffectCallback>

const useOnChange = <T>(callback: ChangeCallback<T>, value: T): void => {
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
