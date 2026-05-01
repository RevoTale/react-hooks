# @revotale/react-hooks

Small React hooks with a stable TypeScript API.

This package is a Bun/tsdown/TypeScript 6 restart of `l-you/react-hooks` and keeps the original root hook exports.

## Install

```sh
bun add @revotale/react-hooks
```

React is a peer dependency.

## Usage

```tsx
import { useBool, useCallTrue, useToggle } from '@revotale/react-hooks'

function Example() {
	const [open, setOpen] = useBool(false)
	const show = useCallTrue(setOpen)
	const toggle = useToggle(setOpen)

	return (
		<>
			<button type="button" onClick={show}>
				Show
			</button>
			<button type="button" onClick={toggle}>
				{open ? 'Hide' : 'Show'}
			</button>
		</>
	)
}
```

Use root named imports. The package is marked as side-effect free, so modern bundlers can tree-shake unused hooks.

## Exports

- `useBool`
- `useCallFalse`
- `useCallTrue`
- `useDecrement`
- `useFocusInput`
- `useHTMLInputRef`
- `useIncrement`
- `useInterval`
- `useNumber`
- `useOnChange`
- `useOnEnterDown`
- `useOnMount`
- `useOnce`
- `usePrevious`
- `usePromiseHandler`
- `usePromiseState`
- `useRequired`
- `useRequiredContext`
- `useTimeout`
- `useTodayMidnight`
- `useToggle`
- `useVariable`
- `useWasInView`
- `useWindow`
- `useWindowHost`
- `useWindowOrigin`
- `useWindowSize`

## Development

```sh
bun install
task validate
task test
task build
task check:package
```

## Release

Use Conventional Commits on `main`. `release-please` opens the release PR; merging it creates the GitHub release and publishes to npm from CI.

Configure npm Trusted Publishing for `.github/workflows/release.yml` after the first package publish. CI uses Bun for install, validation, tests, and build; npm is used only for the final registry publish.
