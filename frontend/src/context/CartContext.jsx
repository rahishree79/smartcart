import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const MAX_QTY = 10

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i._id === action.payload._id)
      if (existing) {
        return state.map(i =>
          i._id === action.payload._id
            ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) }
            : i
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i._id !== action.payload)
    case 'UPDATE_QTY':
      return state.map(i =>
        i._id === action.payload.id
          ? { ...i, quantity: Math.max(1, Math.min(action.payload.qty, MAX_QTY)) }
          : i
      )
    case 'CLEAR_CART':
      return []
    case 'LOAD_CART':
      return action.payload
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('smartcart_cart')) || [] } catch { return [] }
  })()

  const [cart, dispatch] = useReducer(cartReducer, saved)

  useEffect(() => {
    localStorage.setItem('smartcart_cart', JSON.stringify(cart))
  }, [cart])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
