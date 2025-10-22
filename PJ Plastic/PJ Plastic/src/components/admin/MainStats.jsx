import React from 'react';

const MainStats = ({ stats }) => {
  const formatPrice = (price) => {
    return `LKR ${price?.toLocaleString('en-LK') || '0'}`;
  };

  return (
    <div className="main-stats-grid">
      <div className="main-stat-card primary">
        <div className="stat-content">
          <h3>Total Revenue</h3>
          <p className="stat-number">{formatPrice(stats.trailingYear)}</p>
          <p className="stat-subtitle">Current fiscal year</p>
        </div>
        <div className="stat-trend positive">
          <span>↑ {stats.revenueGrowth || 0}%</span>
          <span>Growth Rate</span>
        </div>
      </div>
    </div>
  );
};

export default MainStats;