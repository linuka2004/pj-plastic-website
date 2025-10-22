import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { request } from '../api/client';
import './Checkout.css';

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Sender Details
    senderTitle: '',
    senderFirstName: '',
    senderLastName: '',
    senderMobile: '',
    senderEmail: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    
    // Payment Method
    paymentMethod: 'online'
  });

  const [bankSlip, setBankSlip] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankSlip(file);
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setFormData(prev => ({
              ...prev,
              deliveryAddress: data.display_name
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              deliveryAddress: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
            }));
          }
          
          // Open Google Maps with the location
          window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        } catch (error) {
          console.error('Error getting address:', error);
          setFormData(prev => ({
            ...prev,
            deliveryAddress: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
          }));
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const toLocalDate = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.senderFirstName || !formData.senderLastName || !formData.senderMobile || !formData.senderEmail || !formData.deliveryAddress) {
      alert('Please fill in all required details including delivery address');
      return;
    }

    // Validate payment for online payment
    if (formData.paymentMethod === 'online' && !bankSlip) {
      alert('Please upload your payment slip for online payment');
      return;
    }

    // Logged-in user is preferred, but backend can accept DTO.userId when unauthenticated

    // Build backend DTO
    const now = new Date();
    const delivery = new Date();
    delivery.setDate(now.getDate() + 7);
    const createOrderDto = {
      orderName: `Order-${Date.now()}`,
      orderDate: toLocalDate(now),
      deliveryDate: toLocalDate(delivery),
      // Provide userId when available; backend will also derive from JWT if logged in
      userId: currentUser?.id ? Number(currentUser.id) : null,
      senderName: `${formData.senderTitle} ${formData.senderFirstName} ${formData.senderLastName}`.trim(),
      senderMobile: formData.senderMobile,
      deliveryAddress: formData.deliveryAddress,
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(it => ({ productId: Number(it.id), quantity: Number(it.quantity || 1) }))
    };

    try {
      const created = await request('/orders', { method: 'POST', body: createOrderDto });
      // Clear the cart and deep-link to the backend order so tracking page loads canonical details
      clearCart();
      if (created?.id) {
        navigate(`/order-tracking/${created.id}`);
      } else {
        // Fallback to generic tracking route if backend didn’t return id
        navigate('/order-tracking');
      }
    } catch (e) {
      alert(e?.message || 'Failed to place order. Please try again.');
    }
  };

  // If cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>✅ Checkout</h1>
        </div>
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checkout</p>
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
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>✅ Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        {/* Sender & Delivery Details Section */}
        <div className="checkout-section">
          <h2># Sender & Delivery Details</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="senderTitle">Title*</label>
              <select 
                id="senderTitle"
                name="senderTitle"
                value={formData.senderTitle}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="senderFirstName">First Name*</label>
              <input
                type="text"
                id="senderFirstName"
                name="senderFirstName"
                value={formData.senderFirstName}
                onChange={handleInputChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senderLastName">Last Name*</label>
              <input
                type="text"
                id="senderLastName"
                name="senderLastName"
                value={formData.senderLastName}
                onChange={handleInputChange}
                placeholder="Last name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senderMobile">Mobile* (77XXXXXXX)</label>
              <input
                type="tel"
                id="senderMobile"
                name="senderMobile"
                value={formData.senderMobile}
                onChange={handleInputChange}
                placeholder="77XXXXXXX"
                pattern="77[0-9]{7}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senderEmail">Email Address*</label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                placeholder="mail@example.com"
                required
              />
            </div>

            {/* Delivery Address Section */}
            <div className="form-group full-width">
              <label htmlFor="deliveryAddress">Delivery Address*</label>
              <div className="address-input-container">
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  required
                  className="address-textarea"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="location-btn"
                >
                  {isGettingLocation ? '📍 Getting Location...' : '📍 Find My Location'}
                </button>
              </div>
              <p className="location-help">
                Click "Find My Location" to automatically detect your address and open Google Maps
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Ratnapura"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="e.g., 70000"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="checkout-section">
          <h2># How would you like to pay ?</h2>
          
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === 'online'}
                onChange={() => handlePaymentMethodChange('online')}
              />
              <span className="radio-checkmark"></span>
              Pay Online
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="delivery"
                checked={formData.paymentMethod === 'delivery'}
                onChange={() => handlePaymentMethodChange('delivery')}
              />
              <span className="radio-checkmark"></span>
              Pay On Delivery
            </label>
          </div>

          {/* Bank Details - Show only when Pay Online is selected */}
          {formData.paymentMethod === 'online' && (
            <div className="bank-details">
              <h3>Bank Transfer Details</h3>
              <div className="bank-info">
                <div className="bank-row">
                  <strong>Bank Name:</strong>
                  <span>Commercial Bank</span>
                </div>
                <div className="bank-row">
                  <strong>Account Name:</strong>
                  <span>PJ Plastic (Pvt) Ltd</span>
                </div>
                <div className="bank-row">
                  <strong>Account Number:</strong>
                  <span>1234567890</span>
                </div>
                <div className="bank-row">
                  <strong>Branch:</strong>
                  <span>Ratnapura</span>
                </div>
                <div className="bank-row">
                  <strong>Reference:</strong>
                  <span>Order #{(Math.random() * 1000000).toFixed(0)}</span>
                </div>
              </div>
              
              <div className="slip-upload">
                <h4>Upload Payment Slip</h4>
                <p className="upload-info">Please transfer the amount and upload your payment slip here</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="bankSlip"
                />
                <label htmlFor="bankSlip" className="file-input-label">
                  📎 Choose File
                </label>
                {bankSlip && (
                  <p className="file-info">✅ Uploaded: {bankSlip.name}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h3>📦 Order Summary</h3>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs.{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs.{cartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>Rs.{(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="total-row final-total">
                <strong>Total:</strong>
                <strong>Rs.{(cartTotal * 1.1).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;