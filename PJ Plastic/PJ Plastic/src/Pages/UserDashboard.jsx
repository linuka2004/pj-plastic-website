import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

function UserDashboard() {
  const { currentUser, userData, getUserOrders, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const goToTracking = (order) => {
    // Prefer deep link so the tracking page fetches the latest details itself
    navigate(`/order-tracking/${order.orderId}`);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    (async () => {
      const backendOrders = await getUserOrders();
      // Efficiently fetch product details for all items across orders
      const allItemProductIds = new Set();
      (backendOrders || []).forEach(o => {
        (o.items || []).forEach(it => {
          if (it && typeof it.productId !== 'undefined') allItemProductIds.add(it.productId);
        });
      });

      const productEntries = await Promise.all(
        Array.from(allItemProductIds).map(async (pid) => {
          try {
            const p = await (await import('../api/client')).request(`/products/${pid}`);
            return [pid, p];
          } catch (_) {
            return [pid, null];
          }
        })
      );
      const productMap = Object.fromEntries(productEntries);

      // Map backend order response to UI-friendly shape with product names and prices
      const mapped = (backendOrders || []).map(o => ({
        orderId: o.id,
        orderDate: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '',
        status: o.status || 'Processing',
        items: (o.items || []).map(it => {
          const p = productMap[it.productId];
          return {
            name: p?.name || `Product #${it.productId}`,
            price: Number(p?.price || 0),
            quantity: Number(it.quantity || 1),
          };
        }),
        subtotal: Number(o.subtotal || 0),
        tax: Number(o.tax || 0),
        total: Number(o.total || 0),
        deliveryAddress: o.deliveryAddress || '',
        estimatedDelivery: o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : '',
        paymentMethod: o.paymentMethod || 'delivery',
      }));
      setOrders(mapped);
    })();
  }, [currentUser, getUserOrders, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="user-dashboard">
        <div className="container">
          <div className="not-logged-in">
            <h2>Please log in to view your account</h2>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>Welcome back, {userData?.firstName || 'User'}!</h1>
            <p>Manage your orders and account information</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'orders' ? 'tab-active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders
          </button>
          <button 
            className={activeTab === 'profile' ? 'tab-active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Info
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            {orders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your order history here</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, index) => (
                  <div key={index} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.orderId}</h3>
                        <p className="order-date">{order.orderDate}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status?.toLowerCase()}`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="order-items">
                        <h4>Items:</h4>
                        {order.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="order-item">
                            <span className="item-name">{item.name} x {item.quantity}</span>
                            <span className="item-price">LKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>LKR {order.subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                          <span>Tax:</span>
                          <span>LKR {order.tax?.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                          <strong>Total:</strong>
                          <strong>LKR {order.total?.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="order-footer">
                      <div className="delivery-info">
                        <strong>Delivery to:</strong>
                        <p>{order.deliveryAddress}</p>
                        <p>Estimated delivery: {order.estimatedDelivery}</p>
                      </div>
                      <button className="track-order-btn" onClick={() => goToTracking(order)}>
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="profile-card">
              {!editing ? (
                <>
                  <div className="profile-info">
                    <div className="info-group">
                      <label>Full Name</label>
                      <p>{userData?.fullName || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                      <label>Email</label>
                      <p>{currentUser.email}</p>
                    </div>
                    <div className="info-group">
                      <label>Phone</label>
                      <p>{userData?.phone || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                      <label>Address</label>
                      <p>{userData?.address || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                      <label>Member Since</label>
                      <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setForm({
                        fullName: userData?.fullName || '',
                        email: currentUser.email || '',
                        phone: userData?.phone || '',
                        address: userData?.address || '',
                        password: ''
                      });
                      setEditing(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form
                  className="profile-edit-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    try {
                      await updateProfile(form);
                      setEditing(false);
                      alert('Profile updated successfully');
                    } catch (err) {
                      alert(err?.message || 'Failed to update profile');
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <div className="form-row">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <label>Address</label>
                    <textarea
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="form-row">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setEditing(false)} disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;