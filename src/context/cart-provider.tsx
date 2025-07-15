import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'

interface CartItem {
  product: Product
  price: number
  count: number
  total: number
}

type CartEvent =
  | {
      type: 'ADD'
      item: {
        product: Product
        price: number
      }
    }
  | {
      type: 'REMOVE'
      index: number
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

      const existingItemIndex = state.findIndex(
        cartItem => cartItem.product.name === item.product.name
      )

      if (existingItemIndex !== -1) {
        const updatedCart = [...state]
        const existingItem = updatedCart[existingItemIndex]
        const newCount = existingItem.count + 1
        const newTotal = existingItem.price * newCount
        updatedCart[existingItemIndex] = {
          ...existingItem,
          count: newCount,
          total: newTotal,
        }

        return updatedCart
      }

      return [...state, { ...item, count: 1, total: item.price }]
    }

    case 'REMOVE': {
      const { index } = event
      const itemToRemove = state[index]
      const updatedCart = [...state]

      if (itemToRemove.count === 1) {
        updatedCart.splice(index, 1)

        return updatedCart
      }

      const newCount = itemToRemove.count - 1
      const newTotal = itemToRemove.price * newCount
      updatedCart[index] = {
        ...itemToRemove,
        count: newCount,
        total: newTotal,
      }

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
