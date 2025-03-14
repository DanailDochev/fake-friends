import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage({ userData }) {
  const [stats, setStats] = useState({
    totalFollowers: 0,
    recentUnfollowers: 0,
    lastScan: null
  });

  // Simulate fetching data
  useEffect(() => {
    // In a real app, fetch data from your backend
    const demoStats = {
      totalFollowers: 748,
      recentUnfollowers: 5,
      lastScan: new Date().toISOString()
    };
    
    setTimeout(() => {
      setStats(demoStats);
    }, 500);
  }, [userData]);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome back, @{userData?.username}</h1>
        <p>Let's see who's unfollowed you recently</p>
      </div>
      
      <div className="stats-section">
        <div className="stat-card">
          <h3>Current Followers</h3>
          <div className="stat-value">{stats.totalFollowers}</div>
        </div>
        
        {/* <div className="stat-card highlight">
          <h3>Recent Unfollowers</h3>
          <div className="stat-value">{stats.recentUnfollowers}</div>
        </div> */}
        
        <div className="stat-card">
          <h3>Last Scan</h3>
          <div className="stat-value">
            {stats.lastScan ? new Date(stats.lastScan).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>
      
      <div className="action-section">
        <Link to="/upload" className="primary-button">
          Scan for Unfollowers
        </Link>
        
        <div className="instructions">
          <h3>How to use FakeFriends:</h3>
          <ol>
            <li>Request your Instagram data from Instagram Settings</li>
            <li>Download and extract the zip file when Instagram emails it to you</li>
            <li>Upload the followers_and_following/followers.html file</li>
            <li>We'll compare your previous and current followers to find who unfollowed you</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default HomePage;