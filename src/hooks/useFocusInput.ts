import { type RefObject, useCallback } from 'react'

const useFocusInput = (
	ref: RefObject<HTMLInputElement | null>,
): (() => void) => {
	return useCallback(() => {
		ref.current?.focus()
	}, [ref])
}

export default useFocusInput
