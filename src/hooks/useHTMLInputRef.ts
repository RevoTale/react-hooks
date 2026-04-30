import { type RefObject, useRef } from 'react'

const useHTMLInputRef = (): RefObject<HTMLInputElement | null> => {
	return useRef<HTMLInputElement>(null)
}

export default useHTMLInputRef
