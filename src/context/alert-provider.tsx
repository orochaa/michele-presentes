import { clsx } from 'clsx'
import { Info } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'

export interface IAlertContext
  extends Record<Alert.Type, (message: string) => void> {}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const AlertContext = createContext<IAlertContext>({} as IAlertContext)

type PartialExcept<T, K extends keyof T> = {
  [Key in Exclude<keyof T, K>]?: T[Key]
} & {
  [Key in K]: T[Key]
}

const createAlert = (
  data: PartialExcept<Alert.State, 'message' | 'type'>
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
    const exists = state.find(alert => alert.id === addEvent.data.message)
    const result: Alert.State[] = exists
      ? state.map(alert => {
          return alert.id === addEvent.data.message
            ? formatAlertCounter({ ...alert, isVisible: true }, 1)
            : alert
        })
      : [
          ...state,
          createAlert({
            message: addEvent.data.message,
            type: addEvent.data.type,
          }),
        ]
    const alertsLimit = 5

    return result.length > alertsLimit ? result.slice(1) : result
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
      .filter(Boolean)
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
  const [alerts, addAlertEvent] = useReducer(alertReducer, [])

  const alert = useCallback((type: Alert.Type, message: string): void => {
    if (message && typeof message === 'string') {
      addAlertEvent({
        type: 'ADD',
        data: {
          type,
          message,
        },
      })
      const removeDelay = 4500
      setTimeout(() => {
        addAlertEvent({
          type: 'REMOVE',
          id: message,
        })
      }, removeDelay)
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

  const context = useMemo<IAlertContext>(
    () => ({
      error: (message: string): void => alert('error', message),
      success: (message: string): void => alert('success', message),
    }),
    [alert]
  )

  return (
    <AlertContext.Provider value={context}>
      {children}

      <div className="fixed right-6 bottom-8 z-50 flex flex-col gap-2">
        {alerts.map(alert => (
          <button
            type="button"
            key={alert.id}
            className={clsx(
              'flex max-w-sm min-w-40 items-center justify-center gap-2 rounded-md border-l-4 bg-white p-6 text-sm font-semibold text-black shadow-lg transition duration-300 md:text-base lg:text-lg',
              alert.isVisible ? 'block' : 'hidden',
              {
                'border-gold': alert.type === 'success',
                'border-red-500': alert.type === 'error',
              }
            )}
            onClick={() => clickAlert(alert)}
          >
            <Info size={20} className="shrink-0" />
            {alert.message}
          </button>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export namespace Alert {
  export type Type = 'success' | 'error'

  export interface State {
    id: string
    type: Type
    message: string
    isVisible: boolean
    counter: number
  }

  export type Event =
    | {
        type: 'ADD'
        data: {
          type: Type
          message: string
        }
      }
    | {
        type: 'REMOVE'
        id: string
      }
    | {
        type: 'HIDE'
        id: string
      }

  export type PickEvent<
    TEventType extends Event['type'],
    TEvent = Event,
  > = TEvent extends Event
    ? TEvent['type'] extends TEventType
      ? TEvent
      : never
    : never

  export type Reducer = (state: State[], event: Event) => State[]
}

export function useAlert(): IAlertContext {
  return useContext(AlertContext)
}
