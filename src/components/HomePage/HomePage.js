import React, { useState } from 'react';
import './HomePage.css';

// 1. Mock JSON Data derived from your Excel research
const SCRAP_DATA = [
  { id: 1, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi" },
  { id: 2, category: "Ferrous", material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel" },
  { id: 3, category: "Non-Ferrous", material: "Copper Millberry", location: "Delhi", price: 785, change: 12, type: "Millberry" },
  { id: 4, category: "Non-Ferrous", material: "Aluminium Wire", location: "Alang", price: 212, change: -3, type: "Wire" },
  { id: 5, category: "Non-Ferrous", material: "Brass Honey", location: "Jamnagar", price: 490, change: 5, type: "Honey" },
];

// Reusable Feature Card Component
const FeatureCard = ({ title, description, icon, isComingSoon, onClick }) => (
  <div className="feature-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    {isComingSoon && <div className="coming-soon-badge">Coming Soon!</div>}
    <div className="card-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const HomePage = () => {
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('High-Low');

  // Filtering and Sorting Logic
  const filteredData = SCRAP_DATA
    .filter(item => filterType === 'All' || item.category === filterType)
    .sort((a, b) => sortOrder === 'High-Low' ? b.price - a.price : a.price - b.price);

  return (
    <div className="home-page-wrapper">
      
      {/* --- TOP PRICE TICKER --- */}
      <div className="top-ticker-bar">
        <div className="ticker-content">
          {SCRAP_DATA.map(item => (
            <span key={item.id} className="ticker-item">
              {item.material} ({item.location}): <strong>₹{item.price}</strong> 
              <span className={item.change >= 0 ? "text-up" : "text-down"}>
                {item.change >= 0 ? ' ▲' : ' ▼'}{Math.abs(item.change)}
              </span>
            </span>
          ))}
          {/* Duplicate for seamless scrolling */}
          {SCRAP_DATA.map(item => (
            <span key={`dup-${item.id}`} className="ticker-item">
              {item.material} ({item.location}): <strong>₹{item.price}</strong> 
              <span className={item.change >= 0 ? "text-up" : "text-down"}>
                {item.change >= 0 ? ' ▲' : ' ▼'}{Math.abs(item.change)}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="home-page-container">
        {/* --- HERO SECTION --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Discover & Bid on Unique Items</h1>
            <p className="hero-subtitle">Scrapcy is launching soon. Explore live market trends while we prepare the auction platform!</p>
            <button className="btn">Learn More</button>
          </div>
          <div className="hero-image-placeholder">
            <span role="img" aria-label="Scrapcy Icon">🛒</span>
            <p>Scrapcy Intelligence</p>
          </div>
        </section>

        {/* --- FEATURE CARDS SECTION --- */}
        <section className="features-section">
          <FeatureCard 
            title="Newsletter" 
            description="Subscribe to get daily market reports in your inbox."
            icon="📰" 
            isComingSoon={true}
          />
          <FeatureCard 
            title="Price Tracker" 
            description="View real-time prices for Ferrous & Non-Ferrous scrap."
            icon="📈" 
            isComingSoon={false}
            onClick={() => document.getElementById('price-dashboard').scrollIntoView({ behavior: 'smooth' })}
          />
          <FeatureCard 
            title="E-Auction" 
            description="Our full bidding platform is launching soon."
            icon="🔨" 
            isComingSoon={true}
          />
        </section>

        {/* --- PRICE TRACKER DASHBOARD SECTION --- */}
        <section id="price-dashboard" className="price-dashboard-section">
          <div className="dashboard-header">
            <h2>Market Intelligence Dashboard</h2>
            <div className="dashboard-controls">
              <div className="control-group">
                <label>Filter Material:</label>
                <select onChange={(e) => setFilterType(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Ferrous">Ferrous</option>
                  <option value="Non-Ferrous">Non-Ferrous</option>
                </select>
              </div>
              <div className="control-group">
                <label>Sort Price:</label>
                <select onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="High-Low">High to Low</option>
                  <option value="Low-High">Low to High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="price-grid">
            {filteredData.map(item => (
              <div key={item.id} className="price-card">
                <div className="price-card-header">
                  <span className="location-badge">{item.location}</span>
                  <div className="price-card-actions">
                    <button className="icon-btn" title="Save">🔖</button>
                    <button className="icon-btn" title="Share">🔗</button>
                  </div>
                </div>

                <div className="meter-visual">
                  {/* Gauge Mockup */}
                  <div className="gauge-container">
                    <div className="gauge-body"></div>
                    <div className={`gauge-needle ${item.change >= 0 ? 'pos' : 'neg'}`}></div>
                  </div>
                  <h3>₹{item.price.toLocaleString()}</h3>
                  <p className={item.change >= 0 ? "text-up" : "text-down"}>
                    {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)} (Today)
                  </p>
                </div>

                <h4>{item.material}</h4>
                <p className="item-subtext">{item.type} | {item.category}</p>
                
                <button className="request-details-btn">Request Details</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
