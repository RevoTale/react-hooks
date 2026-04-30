import { useEffect, useState } from 'react'
import useWindow from './useWindow'

const useWindowHost = (): string | null => {
	const [host, setHost] = useState<string | null>(null)
	const currentWindow = useWindow()

	useEffect(() => {
		setHost(currentWindow?.location.host ?? null)
	}, [currentWindow])

	return host
}

export default useWindowHost
