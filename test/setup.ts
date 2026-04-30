import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
	url: 'https://example.test/path',
})

Object.defineProperty(globalThis, 'window', {
	value: dom.window,
	writable: true,
})
Object.defineProperty(globalThis, 'document', {
	value: dom.window.document,
	writable: true,
})
Object.defineProperty(globalThis, 'navigator', {
	value: dom.window.navigator,
	writable: true,
})
Object.defineProperty(globalThis, 'HTMLElement', {
	value: dom.window.HTMLElement,
	writable: true,
})
Object.defineProperty(globalThis, 'KeyboardEvent', {
	value: dom.window.KeyboardEvent,
	writable: true,
})
Object.defineProperty(globalThis, 'Event', {
	value: dom.window.Event,
	writable: true,
})
Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
	value: true,
	writable: true,
})
