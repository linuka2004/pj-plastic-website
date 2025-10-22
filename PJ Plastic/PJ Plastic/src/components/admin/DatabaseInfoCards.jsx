import React from 'react';

const DatabaseInfoCards = ({ databaseStats }) => {
  return (
    <div className="database-info-grid">
      <div className="database-info-card system-card">
        <div className="card-header">
          <div className="card-icon">⚙️</div>
          <h4>System Status</h4>
        </div>
        <div className="card-content">
          <div className="status-item">
            <span className="status-label">Server Status</span>
            <span className={`status-value ${databaseStats.serverStatus?.toLowerCase()}`}>
              {databaseStats.serverStatus || 'Loading...'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Response Time</span>
            <span className="status-value">{databaseStats.responseTime || '...'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">System Uptime</span>
            <span className="status-value">{databaseStats.systemUptime || '...'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Backup</span>
            <span className="status-value">{databaseStats.lastBackup || '...'}</span>
          </div>
        </div>
      </div>

      <div className="database-info-card business-card">
        <div className="card-header">
          <div className="card-icon">📈</div>
          <h4>Business Overview</h4>
        </div>
        <div className="card-content">
          <div className="status-item">
            <span className="status-label">Total Products</span>
            <span className="status-value">{databaseStats.totalProducts || '0'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Low Stock Items</span>
            <span className="status-value warning">{databaseStats.lowStockProducts || '0'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Pending Orders</span>
            <span className="status-value">{databaseStats.pendingOrders || '0'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Active Users</span>
            <span className="status-value">{databaseStats.activeUsers || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfoCards;