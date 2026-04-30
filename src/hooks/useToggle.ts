import { type Dispatch, type SetStateAction, useCallback } from 'react'

type SetBooleanState = Dispatch<SetStateAction<boolean>>

const useToggle = (setValue: SetBooleanState): (() => void) => {
	return useCallback(() => {
		setValue((previous) => !previous)
	}, [setValue])
}

export default useToggle
