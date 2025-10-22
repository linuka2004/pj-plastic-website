import React from 'react';

const RevenueChart = ({ 
  salesData, 
  activeTimeFilter, 
  timeFilters, 
  onTimeFilterChange 
}) => {
  const getMaxSalesValue = () => {
    if (!salesData.length) return 1;
    return Math.max(...salesData.map(item => item.sales));
  };

  const getBarColor = (filter) => {
    switch (filter) {
      case '1W': return '#3498db';
      case '1M': return '#2ecc71';
      case '1Y': return '#e74c3c';
      default: return '#3498db';
    }
  };

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Revenue Overview ({activeTimeFilter})</h3>
        <div className="chart-actions">
          {timeFilters.map(filter => (
            <button 
              key={filter}
              className={`time-filter ${activeTimeFilter === filter ? 'active' : ''}`}
              onClick={() => onTimeFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-area">
        <div className="chart-bars-container">
          <div className="chart-bars">
            {salesData.map((data, index) => (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${(data.sales / getMaxSalesValue()) * 80}%`,
                    backgroundColor: getBarColor(activeTimeFilter)
                  }}
                ></div>
              </div>
            ))}
          </div>
          <div className="chart-dates">
            {salesData.map((data, index) => (
              <span key={index} className="chart-date">{data.day}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;