// context/CartContext.js
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { request } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Initial state with items array
const initialState = { items: [] };

const GUEST_CART_KEY = 'guest_cart_v1';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) { return []; }
}

function saveGuestCart(items) {
  try { localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items || [])); } catch (_) {}
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [] };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Normalize items to state shape {id, name, price, quantity}
  function normalizeServerItems(server) {
    return (server?.items || []).map(i => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity }));
  }

  // Sync server cart into state
  async function loadServerCart() {
    const data = await request('/cart');
    const items = normalizeServerItems(data);
    dispatch({ type: 'SET_CART', payload: items });
  }

  // On auth change: if logged in, merge guest cart to server then load server cart; else load guest from storage
  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const guest = loadGuestCart();
        if (guest.length) {
          // push guest items to server (add or increment quantities)
          for (const it of guest) {
            try { await request('/cart/items', { method: 'POST', body: { productId: it.id, quantity: it.quantity || 1 } }); } catch (_) {}
          }
          saveGuestCart([]);
        }
        try { await loadServerCart(); } catch (e) { /* ignore */ }
      } else {
        const guest = loadGuestCart();
        dispatch({ type: 'SET_CART', payload: guest });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    if (!product?.id) return;
    if (isAuthenticated) {
      try {
        const data = await request('/cart/items', { method: 'POST', body: { productId: product.id, quantity: 1 } });
        const items = normalizeServerItems(data);
        dispatch({ type: 'SET_CART', payload: items });
        return;
      } catch (e) { /* fall back to local */ }
    }
    // guest local: compute next items synchronously then persist
    const prev = state.items || [];
    const existing = prev.find(i => i.id === product.id);
    const next = existing
      ? prev.map(i => i.id === product.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i)
      : [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    dispatch({ type: 'SET_CART', payload: next });
    saveGuestCart(next);
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;
    if (isAuthenticated) {
      try {
        const data = await request(`/cart/items/${productId}`, { method: 'DELETE' });
        const items = normalizeServerItems(data);
        dispatch({ type: 'SET_CART', payload: items });
        return;
      } catch (e) { /* fall back to local */ }
    }
    const prev = state.items || [];
    const next = prev.filter(i => i.id !== productId);
    dispatch({ type: 'SET_CART', payload: next });
    saveGuestCart(next);
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;
    if (isAuthenticated) {
      try {
        const data = await request(`/cart/items/${productId}`, { method: 'PUT', body: { quantity } });
        const items = normalizeServerItems(data);
        dispatch({ type: 'SET_CART', payload: items });
        return;
      } catch (e) { /* fall back to local */ }
    }
    if (quantity <= 0) {
      const prev = state.items || [];
      const next = prev.filter(i => i.id !== productId);
      dispatch({ type: 'SET_CART', payload: next });
      saveGuestCart(next);
    } else {
      const prev = state.items || [];
      const next = prev.map(i => i.id === productId ? { ...i, quantity } : i);
      dispatch({ type: 'SET_CART', payload: next });
      saveGuestCart(next);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try { await request('/cart', { method: 'DELETE' }); dispatch({ type: 'CLEAR_CART' }); return; } catch (_) {}
    }
    dispatch({ type: 'CLEAR_CART' });
    saveGuestCart([]);
  };

  // Safe calculations with defaults
  const cartItems = state?.items || [];
  const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}