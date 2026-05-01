import { type Dispatch, type SetStateAction, useCallback } from 'react'

const useToggle = (
	setValue: Dispatch<SetStateAction<boolean>>,
): (() => void) => {
	return useCallback(() => {
		setValue((previous) => !previous)
	}, [setValue])
}

export default useToggle
