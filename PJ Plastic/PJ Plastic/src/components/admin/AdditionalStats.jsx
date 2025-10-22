import React from 'react';

const AdditionalStats = ({ stats, databaseStats }) => {
  return (
    <div className="additional-stats">
      <div className="additional-stat-card">
        <h4>Active Customers</h4>
        <p className="stat-number-sm">{stats.activeCustomers || 0}</p>
        <span className="stat-change positive">+12 this month</span>
      </div>
      <div className="additional-stat-card">
        <h4>Conversion Rate</h4>
        <p className="stat-number-sm">{stats.conversionRate || 0}%</p>
        <span className="stat-change positive">+0.4%</span>
      </div>
      <div className="additional-stat-card">
        <h4>Customer Satisfaction</h4>
        <p className="stat-number-sm">4.8/5</p>
        <span className="stat-change positive">+0.2 points</span>
      </div>
    </div>
  );
};

export default AdditionalStats;