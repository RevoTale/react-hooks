import { type Dispatch, type SetStateAction, useCallback } from 'react'

type SetNumberState = Dispatch<SetStateAction<number>>

const useIncrement = (setValue: SetNumberState): (() => void) => {
	return useCallback(() => {
		setValue((previous) => previous + 1)
	}, [setValue])
}

export default useIncrement
