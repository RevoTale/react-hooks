import { type Dispatch, type SetStateAction, useCallback } from 'react'

const useIncrement = (
	setValue: Dispatch<SetStateAction<number>>,
): (() => void) => {
	return useCallback(() => {
		setValue((previous) => previous + 1)
	}, [setValue])
}

export default useIncrement
