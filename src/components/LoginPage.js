import React, { useState } from 'react';
import '../styles/LoginPage.css';
import instagramLogo from '../assets/instagram-logo.png';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // In a real app, you would authenticate with Instagram or your backend
    // For demo purposes, we'll simulate a successful login
    setTimeout(() => {
      onLogin({ username, id: Date.now() }); // Simulate user data
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>FakeFriends</h1>
          <p style={{ color: "#000000" }}>Track who unfollowed you on Instagram</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Instagram Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style ={{color: "black"}}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        
        <div className="login-footer">
          <p className="disclaimer">
            FakeFriends is not affiliated with Instagram. We don't store your password.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;