import { type EffectCallback, useEffect } from 'react'
import useVariable from './useVariable'

const useOnMount = (callback: EffectCallback): void => {
	const callbackRef = useVariable(callback)

	useEffect(() => {
		return callbackRef.current()
	}, [callbackRef])
}

export default useOnMount
