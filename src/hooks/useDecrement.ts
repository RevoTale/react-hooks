import { type Dispatch, type SetStateAction, useCallback } from 'react'

type SetNumberState = Dispatch<SetStateAction<number>>

const useDecrement = (setValue: SetNumberState): (() => void) => {
	return useCallback(() => {
		setValue((previous) => previous - 1)
	}, [setValue])
}

export default useDecrement
