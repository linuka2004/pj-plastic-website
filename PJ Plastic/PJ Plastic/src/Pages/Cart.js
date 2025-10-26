import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // When quantity goes to 0, remove the item entirely
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    // Directly navigate to checkout without auth check
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString('en-LK')}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 Shopping Cart</h1>
        </div>
        <div className="empty-cart">
          <h2>Your cart is empty 🛒</h2>
          <p>Add some products to get started!</p>
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <button 
          onClick={clearCart}
          className="clear-cart-btn"
        >
          🗑️ Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="placeholder-image">🖼️</div>
                )}
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name || 'Product Name'}</h3>
                <p className="item-price">{formatPrice(item.price || 0)}</p>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                  aria-label="Decrease quantity"
                >
                  ➖
                </button>
                <span className="quantity">{item.quantity || 1}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                  aria-label="Increase quantity"
                >
                  ➕
                </button>
              </div>

              <div className="item-total">
                {formatPrice(((item.price || 0) * (item.quantity || 1)))}
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>📋 Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cartCount}):</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>🚚 Shipping:</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="summary-row">
            <span>💰 Tax:</span>
            <span>{formatPrice(cartTotal * 0.1)}</span>
          </div>
          <div className="summary-row total">
            <span>💳 Total:</span>
            <span>{formatPrice(cartTotal * 1.1)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="checkout-btn"
          >
            ✅ Proceed to Checkout
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping-btn"
          >
            🛍️ Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;