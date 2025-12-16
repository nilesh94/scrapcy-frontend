// src/components/Header/Header.js
import React from 'react';
import './Header.css';

const Header = () => {
  // Functionality to handle navigation will be added later, e.g., using React Router
  const handleAuthClick = () => {
    console.log("Navigating to Login/Register page...");
    // Future: navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          {/* Using a simple text logo placeholder for now */}
          <span className="logo-icon">✔</span>
          Scrapcy
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#css">CSS</a> {/* Placeholder link */}
        </nav>
        <button className="btn auth-btn" onClick={handleAuthClick}>
          Login/Register
        </button>
      </div>
    </header>
  );
};

export default Header;
