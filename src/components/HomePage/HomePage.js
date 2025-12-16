// src/components/HomePage/HomePage.js
import React from 'react';
import './HomePage.css';

// Reusable Feature Card Component
const FeatureCard = ({ title, description, icon }) => (
  <div className="feature-card">
    <div className="coming-soon-badge">Coming Soon!</div>
    <div className="card-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover & Bid on Unique Items</h1>
          <p className="hero-subtitle">Scrapcy is launching soon. Get ready for an online auction experience!</p>
          <button className="btn">Learn More</button>
        </div>
        <div className="hero-image-placeholder">
          <span role="img" aria-label="Scrapcy Icon">🛒</span>
          <p>Scrapcy.js</p>
        </div>
      </section>

      {/* 2. Feature Cards Section */}
      <section className="features-section">
        <FeatureCard 
          title="Newsletter" 
          description="Stay updated with the latest auctions and news."
          icon="📰" 
        />
        <FeatureCard 
          title="Price Tracker" 
          description="Monitor item prices and get alerts."
          icon="📈" 
        />
        <FeatureCard 
          title="E-Auction" 
          description="Our full bidding platform is coming soon."
          icon="🔨" 
        />
      </section>

      {/* 3. About Section (Integrated into the Footer layout in the image) */}
      <section id="about" className="about-section">
        {/* Content now primarily handled by the Footer component, but keeping section tag for structure */}
      </section>
    </div>
  );
};

export default HomePage;
