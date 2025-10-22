import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { request } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './OrderTracking.css';

function OrderTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser, userData } = useAuth();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [trackingNumber] = useState('USPS' + Math.random().toString(36).substr(2, 17).toUpperCase());

  useEffect(() => {
    let cancelled = false;

    const fromState = location.state?.order;
    const idParam = params.id;

    async function loadById(orderId) {
      try {
        const o = await request(`/orders/${orderId}`);
        // Fetch product details for item names/prices
        const items = Array.isArray(o.items) ? o.items : [];
        const detailedItems = await Promise.all(items.map(async (it) => {
          try {
            const p = await request(`/products/${it.productId}`);
            return {
              name: p?.name || `Product #${it.productId}`,
              price: Number(p?.price || 0),
              quantity: Number(it.quantity || 1),
            };
          } catch (_e) {
            return { name: `Product #${it.productId}`, price: 0, quantity: Number(it.quantity || 1) };
          }
        }));

        const orderData = {
          orderId: o.id,
          backendId: o.id,
          customerName: userData?.fullName || currentUser?.username || 'Customer',
          email: currentUser?.email || '',
          mobile: userData?.phone || '',
          deliveryAddress: o.deliveryAddress || '',
          city: '',
          postalCode: '',
          paymentMethod: o.paymentMethod || 'delivery',
          items: detailedItems,
          total: Number(o.total || 0),
          subtotal: Number(o.subtotal || 0),
          tax: Number(o.tax || 0),
          orderDate: o.orderDate || '',
          estimatedDelivery: o.deliveryDate || '',
          status: o.status || 'processing',
        };
        if (!cancelled) {
          setOrder(orderData);
          setCurrentStatus(orderData.status || 'confirmed');
        }
      } catch (e) {
        // If unauthenticated or not found, go home
        if (!cancelled) navigate('/');
      }
    }

    if (fromState) {
      setOrder(fromState);
      setCurrentStatus(fromState.status || 'confirmed');
    } else if (idParam) {
      loadById(idParam);
    } else {
      navigate('/');
    }
    return () => {
      cancelled = true;
    };
  }, [location, params, navigate, currentUser, userData]);

  const statusSteps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: '✅', description: 'Order confirmation is sent to your email' },
    { id: 'processing', label: 'Processing', icon: '🔄', description: 'We are preparing your order' },
    { id: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order has been shipped' },
    { id: 'delivered', label: 'Delivered', icon: '📦', description: 'Your order has been delivered' }
  ];

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(step => step.id === status);
  };

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7); // 7 days from now
    return deliveryDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDeliveryRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    startDate.setDate(today.getDate() + 5); // 5 days from now
    endDate.setDate(today.getDate() + 10); // 10 days from now
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (!order) {
    return (
      <div className="order-tracking-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="tracking-header">
        <h1>✅ Order Confirmed!</h1>
        <p className="order-id">Order ID: {order.orderId}</p>
        <p className="delivery-estimate">Delivery: {getDeliveryRange()}</p>
        <p className="delivery-stats">76.2% are ≤ 10 days</p>
      </div>

      <div className="tracking-content">
        {/* Progress Timeline */}
        <div className="timeline-section">
          <div className="progress-steps">
            {statusSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${index <= getStatusIndex(currentStatus) ? 'active' : ''} ${index < getStatusIndex(currentStatus) ? 'completed' : ''}`}
              >
                <div className="step-indicator">
                  <div className="step-icon">{step.icon}</div>
                  {index < statusSteps.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
                <div className="step-content">
                  <div className="step-label">{step.label}</div>
                  <div className="step-description">
                    {step.id === 'confirmed' && `Order confirmation is sent to ${order.email}`}
                    {step.id === 'processing' && 'Your order is being processed'}
                    {step.id === 'shipped' && 'Your order is on the way'}
                    {step.id === 'delivered' && 'Expected by ' + getEstimatedDeliveryDate()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Information */}
        <div className="tracking-info-section">
          <div className="tracking-card">
            <h3>📦 Tracking Information</h3>
            <div className="tracking-number">
              <strong>Tracking Number:</strong>
              <span className="tracking-code">{trackingNumber}</span>
            </div>
            <div className="carrier-info">
              <strong>Carrier:</strong>
              <span>SLPS (Sri Lankan Postal Service)</span>
            </div>
            <button className="track-button">
              🔍 Track Package
            </button>
          </div>

          <div className="order-summary-card">
            <h3>📋 Order Summary</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x {item.quantity}</span>
                  </div>
                  <span className="item-price">Rs.{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>Rs.{(order.total / 1.1).toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Tax (10%):</span>
                <span>Rs.{(order.total * 0.1 / 1.1).toFixed(2)}</span>
              </div>
              <div className="total-line grand-total">
                <strong>Total:</strong>
                <strong>Rs.{order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="order-details-grid">
          <div className="detail-card">
            <h4>👤 Customer Information</h4>
            <div className="info-group">
              <div className="info-item">
                <strong>Name:</strong>
                <span>{order.customerName}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong>
                <span>{order.email}</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <span>{order.mobile}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h4>📍 Delivery Address</h4>
            <div className="address-details">
              <p>{order.deliveryAddress}</p>
              <p>{order.city}, {order.postalCode}</p>
            </div>
          </div>

          <div className="detail-card">
            <h4>💳 Payment Information</h4>
            <div className="info-group">
              <div className="info-item">
                <strong>Payment Method:</strong>
                <span>{order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
              </div>
              <div className="info-item">
                <strong>Order Date:</strong>
                <span>{order.orderDate}</span>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <span className="status-tag">{currentStatus}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h4>📞 Support</h4>
            <div className="support-info">
              <p>Need help with your order?</p>
              <div className="contact-options">
                <button className="support-btn">📧 Email Support</button>
                <button className="support-btn">📞 Call Support</button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Confirmation Notice */}
        <div className="confirmation-notice">
          <div className="notice-icon">✅</div>
          <div className="notice-content">
            <h4>Order confirmation sent</h4>
            <p>Order confirmation has been sent to {order.email}</p>
            <small>You will receive shipping updates via email and SMS</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/')}
            className="home-btn"
          >
            Back to Home
          </button>
          <button 
            onClick={() => window.print()}
            className="print-btn"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;