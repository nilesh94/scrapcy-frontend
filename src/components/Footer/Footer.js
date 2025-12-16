// src/components/Footer/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>About Scrapcy</h3>
          <p>Scrapcy aims to be a premier online platform connecting buyers, and its sellers, across the globe.</p>
        </div>
        <div className="footer-links">
          <p>© {new Date().getFullYear()} Scrapcy E-Auction. All rights reserved.</p>
          <p>
            <a href="#privacy">Privacy Policy</a> | 
            <a href="#terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
