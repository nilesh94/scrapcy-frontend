import React, { useState } from 'react';
import './PriceTracker.css';
import { ArrowUpRight, ArrowDownRight, Minus, Lock, ShieldCheck } from 'lucide-react';

// Extended Mock Data based on your Excel sheet "research (1).xlsx"
const MARKET_DATA = [
  { id: 101, category: "Scrap & Metallics", sub_category: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi", contact: "Raipur Ispat" },
  { id: 102, category: "Scrap & Metallics", sub_category: "Sponge Iron", location: "Durgapur", price: 32800, change: -50, type: "Mandi", contact: "Durgapur Traders" },
  { id: 103, category: "Scrap & Metallics", sub_category: "Pig Iron Foundry", location: "Ahmedabad", price: 41000, change: 0, type: "Foundry", contact: "Gujarat Iron" },
  { id: 104, category: "Scrap & Metallics", sub_category: "Melting Scrap", location: "Alang", price: 36500, change: 150, type: "HMS", contact: "Alang Recyclers" },
  { id: 201, category: "Non Ferrous", sub_category: "Copper", location: "Delhi", price: 745, change: 5, type: "Millberry", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non Ferrous", sub_category: "Copper", location: "Mumbai", price: 740, change: -2, type: "Armature", contact: "Mumbai Scrap Corp" },
  { id: 203, category: "Non Ferrous", sub_category: "Aluminium", location: "Alang", price: 212, change: -1, type: "Wire", contact: "Gujarat Alloys" },
  { id: 204, category: "Non Ferrous", sub_category: "Brass", location: "Jamnagar", price: 490, change: 0, type: "Honey", contact: "Jamnagar Brass" },
];

const PriceTracker = () => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [unlockedDetails, setUnlockedDetails] = useState({});

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

  // --- HELPER FUNCTIONS FOR COLOR CODING ---
  const getStatusColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getStatusIcon = (change) => {
    if (change > 0) return <ArrowUpRight size={18} />;
    if (change < 0) return <ArrowDownRight size={18} />;
    return <Minus size={18} />;
  };

  const getNeedleRotation = (change) => {
    if (change > 0) return '45deg';
    if (change < 0) return '-45deg';
    return '0deg';
  };

  const handleUnlockPrice = (id) => {
    const confirmUnlock = window.confirm("Unlock verified contact details for $5?");
    if (confirmUnlock) {
      setTimeout(() => {
        setUnlockedDetails(prev => ({ ...prev, [id]: true }));
      }, 500);
    }
  };

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
            
            {/* Top Bar */}
            <div className="pt-card-top">
              <span className={`cat-badge ${item.category === 'Non Ferrous' ? 'nf' : 'fe'}`}>
                {item.category}
              </span>
              <div className={`flex items-center gap-1 font-bold ${getStatusColor(item.change)}`}>
                 {getStatusIcon(item.change)}
                 {item.change === 0 ? "0.0" : Math.abs(item.change)}
              </div>
            </div>

            {/* Gauge Graphic */}
            <div className="pt-visuals">
              <div className="gauge-box">
                 {/* Gauge Background */}
                 <div className="gauge-arc"></div>
                 
                 {/* Needle */}
                 <div 
                   className="gauge-needle" 
                   style={{ 
                     transform: `translateX(-50%) rotate(${getNeedleRotation(item.change)})`,
                     backgroundColor: item.change === 0 ? '#6b7280' : '#1e3a8a' // Grey if 0, Navy otherwise
                   }}
                 ></div>

                 {/* Center Dot */}
                 <div className={`gauge-dot ${item.change === 0 ? 'bg-gray-400' : 'bg-orange'}`}></div>
              </div>
              
              <div className="price-block">
                <h3>₹{item.price.toLocaleString()}</h3>
                <span className={`text-sm font-bold ${getStatusColor(item.change)}`}>
                  {item.change > 0 ? "▲ High Demand" : (item.change < 0 ? "▼ Low Demand" : "— Stable")}
                </span>
              </div>
            </div>

            <div className="pt-info">
              <h4>{item.sub_category}</h4>
              <p>Location: <strong>{item.location}</strong></p>
              <p className="spec-type">Type: {item.type}</p>
            </div>

            {/* Unlock Logic */}
            <div className="pt-unlock-section">
                {unlockedDetails[item.id] ? (
                  <div className="verified-contact">
                    <p className="contact-label"><ShieldCheck size={12}/> Verified Contact:</p>
                    <p className="contact-info">{item.contact}</p>
                  </div>
                ) : (
                  <button onClick={() => handleUnlockPrice(item.id)} className="pt-btn">
                     <Lock size={14} /> Request Details
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;
