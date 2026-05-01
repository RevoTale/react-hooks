import { useCallback } from 'react'

const useCallTrue = (setValue: (value: boolean) => void): (() => void) => {
	return useCallback(() => {
		setValue(true)
	}, [setValue])
}

export default useCallTrue
