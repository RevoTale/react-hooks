import { useCallback } from 'react'

type SetBoolean = (value: boolean) => void

const useCallTrue = (setValue: SetBoolean): (() => void) => {
	return useCallback(() => {
		setValue(true)
	}, [setValue])
}

export default useCallTrue
