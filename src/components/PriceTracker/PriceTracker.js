import React, { useState } from 'react';
import './PriceTracker.css';

// Mock JSON Data from your Excel reference
const initialData = [
  { id: 1, material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi" },
  { id: 2, material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel" },
  { id: 3, material: "Copper Millberry", location: "Delhi", price: 780, change: 12, type: "Non-Ferrous" },
  { id: 4, material: "Aluminium Wire", location: "Alang", price: 210, change: -2, type: "Non-Ferrous" },
];

const PriceTracker = () => {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState('');

  return (
    <div className="price-tracker-container">
      <div className="tracker-header">
        <h2>Live Market Intelligence</h2>
        <div className="controls">
          <select onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="">Filter by Material</option>
            <option value="Sponge Iron">Sponge Iron</option>
            <option value="Copper">Copper</option>
          </select>
          <select className="sort-select">
            <option>Sort By: Price (High-Low)</option>
            <option>Sort By: Day Change</option>
          </select>
        </div>
      </div>

      <div className="tracker-grid">
        {data.map(item => (
          <div key={item.id} className="tracker-card">
            <div className="card-top">
              <span className="location-tag">{item.location}</span>
              <div className="actions">
                <button title="Save">🔖</button>
                <button title="Share">🔗</button>
              </div>
            </div>
            
            <div className="meter-section">
               {/* Visual representation of the price meter */}
               <div className="gauge-placeholder">
                  <div className="gauge-arrow" style={{ transform: `rotate(${item.change > 0 ? '45deg' : '-45deg'})` }}></div>
               </div>
               <h3>₹{item.price.toLocaleString()}</h3>
               <p className={item.change >= 0 ? "change-up" : "change-down"}>
                 {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}
               </p>
            </div>

            <h4>{item.material}</h4>
            <p className="material-type">{item.type}</p>
            
            <button className="request-btn">Request Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;
