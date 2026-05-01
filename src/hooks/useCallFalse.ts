import { useCallback } from 'react'

const useCallFalse = (setValue: (value: boolean) => void): (() => void) => {
	return useCallback(() => {
		setValue(false)
	}, [setValue])
}

export default useCallFalse
