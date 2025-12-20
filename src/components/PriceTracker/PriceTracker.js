// src/components/PriceTracker/PriceTracker.js
import React, { useState } from 'react';
import './PriceTracker.css';

// Extended Mock Data based on your Excel sheet "research (1).xlsx"
const MARKET_DATA = [
  { id: 101, category: "Scrap & Metallics", sub_category: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi" },
  { id: 102, category: "Scrap & Metallics", sub_category: "Sponge Iron", location: "Durgapur", price: 32800, change: -50, type: "Mandi" },
  { id: 103, category: "Scrap & Metallics", sub_category: "Pig Iron Foundry", location: "Ahmedabad", price: 41000, change: 0, type: "Foundry" },
  { id: 104, category: "Scrap & Metallics", sub_category: "Melting Scrap", location: "Alang", price: 36500, change: 150, type: "HMS" },
  { id: 201, category: "Non Ferrous", sub_category: "Copper", location: "Delhi", price: 745, change: 5, type: "Millberry" },
  { id: 202, category: "Non Ferrous", sub_category: "Copper", location: "Mumbai", price: 740, change: -2, type: "Armature" },
  { id: 203, category: "Non Ferrous", sub_category: "Aluminium", location: "Alang", price: 212, change: -1, type: "Wire" },
  { id: 204, category: "Non Ferrous", sub_category: "Brass", location: "Jamnagar", price: 490, change: 8, type: "Honey" },
];

const PriceTracker = () => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  // 1. Filter Logic
  let processedData = MARKET_DATA.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const locationMatch = filterLocation === 'All' || item.location === filterLocation;
    return categoryMatch && locationMatch;
  });

  // 2. Sort Logic
  if (sortOrder === 'high-low') {
    processedData.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'low-high') {
    processedData.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'volatility') {
    processedData.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }

  // Get unique locations for dropdown
  const uniqueLocations = [...new Set(MARKET_DATA.map(item => item.location))];

  return (
    <div className="price-tracker-page">
      <div className="pt-header">
        <h2>Live Market Intelligence</h2>
        <p>Real-time pricing for Ferrous and Non-Ferrous scrap across key Indian mandis.</p>
        
        {/* Controls Bar */}
        <div className="pt-controls">
          <div className="control-group">
            <select onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Scrap & Metallics">Scrap & Metallics</option>
              <option value="Non Ferrous">Non Ferrous</option>
            </select>
          </div>

          <div className="control-group">
            <select onChange={(e) => setFilterLocation(e.target.value)}>
              <option value="All">All Locations</option>
              {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="control-group">
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Sort By: Default</option>
              <option value="high-low">Price: High to Low</option>
              <option value="low-high">Price: Low to High</option>
              <option value="volatility">Highest Volatility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="pt-grid">
        {processedData.map(item => (
          <div key={item.id} className="pt-card">
            <div className="pt-card-top">
              <span className={`cat-badge ${item.category === 'Non Ferrous' ? 'nf' : 'fe'}`}>
                {item.category}
              </span>
              <div className="pt-actions">
                <button title="Save to Watchlist">🔖</button>
                <button title="Share">🔗</button>
              </div>
            </div>

            <div className="pt-visuals">
              {/* Gauge Graphic Mockup */}
              <div className="gauge-box">
                 <div className="gauge-arc"></div>
                 <div className="gauge-needle" style={{ 
                   transform: `translateX(-50%) rotate(${item.change * 0.5}deg)` // Dynamic rotation
                 }}></div>
              </div>
              <div className="price-block">
                <h3>₹{item.price.toLocaleString()}</h3>
                <span className={item.change >= 0 ? "change-up" : "change-down"}>
                  {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}
                </span>
              </div>
            </div>

            <div className="pt-info">
              <h4>{item.sub_category}</h4>
              <p>Location: <strong>{item.location}</strong></p>
              <p className="spec-type">Type: {item.type}</p>
            </div>

            <button className="pt-btn">Request Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;
