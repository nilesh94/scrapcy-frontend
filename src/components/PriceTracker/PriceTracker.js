import React, { useState } from 'react';
import './PriceTrackerPage.css';

// Mock Data (Same as before)
const SCRAP_DATA = [
  { id: 1, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi" },
  { id: 2, category: "Ferrous", material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel" },
  { id: 3, category: "Non-Ferrous", material: "Copper Millberry", location: "Delhi", price: 785, change: 12, type: "Millberry" },
  { id: 4, category: "Non-Ferrous", material: "Aluminium Wire", location: "Alang", price: 212, change: -3, type: "Wire" },
  { id: 5, category: "Non-Ferrous", material: "Brass Honey", location: "Jamnagar", price: 490, change: 5, type: "Honey" },
];

const PriceTrackerPage = () => {
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('High-Low');

  const filteredData = SCRAP_DATA
    .filter(item => filterType === 'All' || item.category === filterType)
    .sort((a, b) => sortOrder === 'High-Low' ? b.price - a.price : a.price - b.price);

  return (
    <div className="tracker-page-container">
      <div className="dashboard-header">
        <h2>Market Intelligence Dashboard</h2>
        <p>Real-time scrap prices and trends across India.</p>
        
        <div className="dashboard-controls">
          <div className="control-group">
            <label>Filter Category:</label>
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
              <div className="gauge-container">
                <div className="gauge-body"></div>
                <div className={`gauge-needle ${item.change >= 0 ? 'pos' : 'neg'}`}></div>
              </div>
              <h3>₹{item.price.toLocaleString()}</h3>
              <p className={item.change >= 0 ? "text-up" : "text-down"}>
                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}
              </p>
            </div>

            <h4>{item.material}</h4>
            <p className="item-subtext">{item.type} | {item.category}</p>
            
            <button className="request-details-btn">Request Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTrackerPage;
