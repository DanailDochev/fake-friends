import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ onLogout, username }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="logo">FakeFriends</Link>
      </div>
      
      <div className="navbar-center">
        <Link to="/home" className="nav-link">Dashboard</Link>
        <Link to="/upload" className="nav-link">Upload Lists</Link>
      </div>
      
      <div className="navbar-right">
        <span className="username">@{username}</span>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;