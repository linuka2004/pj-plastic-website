import React from 'react';

const DashboardHeader = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-header-main">
      <div className="header-left">
        <h1>{getGreeting()}, Admin</h1>
        <p className="current-date">{getCurrentDate()}</p>
      </div>
      <div className="header-right">
        <div className="current-time">{getCurrentTime()}</div>
      </div>
    </div>
  );
};

export default DashboardHeader;