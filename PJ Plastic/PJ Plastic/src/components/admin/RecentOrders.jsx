import React from 'react';

const RecentOrders = ({ recentOrders }) => {
  const formatPrice = (price) => {
    return `LKR ${price?.toLocaleString('en-LK') || '0'}`;
  };

  return (
    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <div className="orders-list">
        {recentOrders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-info">
              <span className="order-id">{order.id}</span>
              <span className="customer-name">{order.customer}</span>
            </div>
            <div className="order-details">
              <span className="order-amount">{formatPrice(order.amount)}</span>
              <span className={`order-status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
              <span className="order-date">{order.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;