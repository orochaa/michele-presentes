import { clsx } from 'clsx'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'

interface IAlertContext {
  popMessage: (message: string) => void
}

export const AlertContext = createContext<IAlertContext>({
  popMessage() {},
})

type PartialExcept<T, K extends keyof T> = {
  [Key in Exclude<keyof T, K>]?: T[Key]
} & {
  [Key in K]: T[Key]
}

const createAlert = (
  data: PartialExcept<Alert.State, 'message'>
): Alert.State => ({
  id: data.message,
  counter: 1,
  isVisible: true,
  ...data,
})

const formatAlertCounter = (alert: Alert.State, count: number): Alert.State => {
  return createAlert({
    ...alert,
    counter: alert.counter + count,
    message: `${alert.id} #${alert.counter + count}`,
  })
}

const alertReducer: Alert.Reducer = (state, event) => {
  const addAlert = (addEvent: Alert.PickEvent<'ADD'>): Alert.State[] => {
    const exists = state.find(alert => alert.id === addEvent.message)
    const result: Alert.State[] = exists
      ? state.map(alert => {
          return alert.id === addEvent.message
            ? formatAlertCounter({ ...alert, isVisible: true }, 1)
            : alert
        })
      : [...state, createAlert({ message: addEvent.message })]

    return result.length > 5 ? result.slice(1) : result
  }

  const hideAlert = (hideEvent: Alert.PickEvent<'HIDE'>): Alert.State[] => {
    return state.map(alert =>
      alert.id === hideEvent.id
        ? createAlert({ ...alert, isVisible: false })
        : alert
    )
  }

  const removeAlert = (
    removeEvent: Alert.PickEvent<'REMOVE'>
  ): Alert.State[] => {
    return state
      .map(alert =>
        alert.id === removeEvent.id
          ? alert.counter === 1
            ? null
            : formatAlertCounter(alert, -1)
          : alert
      )
      .filter(Boolean) as Alert.State[]
  }

  switch (event.type) {
    case 'ADD':
      return addAlert(event)
    case 'REMOVE':
      return removeAlert(event)
    case 'HIDE':
      return hideAlert(event)
    default:
      return state
  }
}

interface AlertProviderProps {
  children: ReactNode
}

export function AlertProvider({
  children,
}: AlertProviderProps): React.JSX.Element {
  const [alerts, addAlertEvent] = useReducer(alertReducer, [
    // { id: '1', counter: 1, isVisible: true, message: '123' } as Alert.State
  ])

  const popMessage = useCallback((message: string): void => {
    if (message && typeof message === 'string') {
      addAlertEvent({
        type: 'ADD',
        message,
      })
      setTimeout(() => {
        addAlertEvent({
          type: 'REMOVE',
          id: message,
        })
      }, 4500)
    }
  }, [])

  const clickAlert = useCallback((alert: Alert.State): void => {
    addAlertEvent({
      type: 'HIDE',
      id: alert.id,
    })
    setTimeout(() => {
      addAlertEvent({
        type: 'REMOVE',
        id: alert.id,
      })
    }, 400)
  }, [])

  const context = useMemo<IAlertContext>(() => ({ popMessage }), [popMessage])

  return (
    <AlertContext.Provider value={context}>
      {children}

      <div
        data-testid="alert-container"
        className="fixed top-20 left-1/2 z-50 -translate-x-1/2"
      >
        {alerts.map(alert => (
          <button
            key={alert.id}
            type="button"
            data-testid="alert"
            className={clsx(
              'flex items-center justify-center gap-2',
              'rounded-md border-2 border-red-500 bg-zinc-100',
              'max-w-sm min-w-[10rem] p-6 text-sm font-semibold text-black shadow-lg',
              'transition duration-300 md:text-base lg:text-lg',
              alert.isVisible ? 'block' : 'hidden'
            )}
            onClick={() => clickAlert(alert)}
          >
            {alert.message}
          </button>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export function useAlert(): IAlertContext {
  return useContext(AlertContext)
}

export namespace Alert {
  export interface State {
    id: string
    message: string
    isVisible: boolean
    counter: number
  }

  export type Event =
    | {
        type: 'ADD'
        message: string
      }
    | {
        type: 'REMOVE'
        id: string
      }
    | {
        type: 'HIDE'
        id: string
      }

  export type PickEvent<T extends Event['type'], K = Event> = K extends Event
    ? K['type'] extends T
      ? K
      : never
    : never

  export type Reducer = (state: State[], event: Event) => State[]
}
