import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'

interface CartItem {
  product: Product
  price: number
  count: number
  observation?: string
  total: number
}

type CartEvent =
  | {
      type: 'ADD'
      item: Omit<CartItem, 'total'>
    }
  | {
      type: 'REMOVE'
      index: number
    }
  | {
      type: 'UPDATE-QUANTITY'
      index: number
      count: number
    }

interface ICartContext {
  addCartEvent: (event: CartEvent) => void
  cart: CartItem[]
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
})

function cartReducer(state: CartItem[], event: CartEvent): CartItem[] {
  switch (event.type) {
    case 'ADD': {
      const { item } = event
      const total = item.price * item.count

      return [...state, { ...item, total }]
    }
    case 'REMOVE':
      return state.filter((_, i) => i !== event.index)

    case 'UPDATE-QUANTITY': {
      const { index, count } = event
      const updatedCart = [...state]
      const item = updatedCart[index]
      const total = item.price * count
      updatedCart[index] = { ...item, count, total }

      return updatedCart
    }
    default:
      return state
  }
}

export function CartProvider(props: {
  children: ReactNode
}): React.JSX.Element {
  const [cart, addCartEvent] = useReducer(cartReducer, [])

  const context = useMemo<ICartContext>(() => ({ cart, addCartEvent }), [cart])

  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  )
}

export function useCart(): ICartContext {
  return useContext(CartContext)
}
