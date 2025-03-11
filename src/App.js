import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Navbar onLogout={handleLogout} username={userData?.username} />}
        <Routes>
          <Route path="/" element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/home" />} />
          <Route path="/home" element={isLoggedIn ? <HomePage userData={userData} /> : <Navigate to="/" />} />
          <Route path="/upload" element={isLoggedIn ? <UploadPage userData={userData} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;