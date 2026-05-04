import { afterEach, expect } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register({
	url: 'https://example.test/path',
})

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
	value: true,
	writable: true,
})

const [{ cleanup }, matchers] = await Promise.all([
	import('@testing-library/react'),
	import('@testing-library/jest-dom/matchers'),
])

expect.extend(matchers)

afterEach(() => {
	cleanup()
})
