import { useCallback } from 'react'

type SetBoolean = (value: boolean) => void

const useCallFalse = (setValue: SetBoolean): (() => void) => {
	return useCallback(() => {
		setValue(false)
	}, [setValue])
}

export default useCallFalse
