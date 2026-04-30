const useWindow = (): Window | null => {
	if (typeof window === 'undefined') {
		return null
	}

	return window
}

export default useWindow
