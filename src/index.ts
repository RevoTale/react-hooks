import useBool from './hooks/useBool'
import useCallFalse from './hooks/useCallFalse'
import useCallTrue from './hooks/useCallTrue'
import useDecrement from './hooks/useDecrement'
import useFocusInput from './hooks/useFocusInput'
import useHTMLInputRef from './hooks/useHTMLInputRef'
import useIncrement from './hooks/useIncrement'
import useInterval from './hooks/useInterval'
import useNumber from './hooks/useNumber'
import useOnChange from './hooks/useOnChange'
import useOnce from './hooks/useOnce'
import useOnEnterDown from './hooks/useOnEnterDown'
import useOnMount from './hooks/useOnMount'
import usePrevious from './hooks/usePrevious'
import usePromiseHandler from './hooks/usePromiseHandler'
import {
	PromiseHandlerState,
	default as usePromiseState,
} from './hooks/usePromiseState'
import useRequired from './hooks/useRequired'
import useRequiredContext from './hooks/useRequiredContext'
import useTimeout from './hooks/useTimeout'
import useTodayMidnight from './hooks/useTodayMidnight'
import useToggle from './hooks/useToggle'
import useVariable from './hooks/useVariable'
import useWasInView from './hooks/useWasInView'
import useWindow from './hooks/useWindow'
import useWindowHost from './hooks/useWindowHost'
import useWindowOrigin from './hooks/useWindowOrigin'
import useWindowSize from './hooks/useWindowSize'

export type {
	PromiseHandlerError,
	PromiseHandlerOptions,
	PromiseHandlerResult,
	PromiseState,
} from './hooks/usePromiseHandler'
export type { WasInViewOptions, WasInViewResult } from './hooks/useWasInView'
export type { WindowSize } from './hooks/useWindowSize'

export {
	PromiseHandlerState,
	useBool,
	useCallFalse,
	useCallTrue,
	useDecrement,
	useFocusInput,
	useHTMLInputRef,
	useIncrement,
	useInterval,
	useNumber,
	useOnChange,
	useOnce,
	useOnEnterDown,
	useOnMount,
	usePrevious,
	usePromiseHandler,
	usePromiseState,
	useRequired,
	useRequiredContext,
	useTimeout,
	useTodayMidnight,
	useToggle,
	useVariable,
	useWasInView,
	useWindow,
	useWindowHost,
	useWindowOrigin,
	useWindowSize,
}
