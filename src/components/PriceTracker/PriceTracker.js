import React, { useState, useMemo } from 'react';
import './PriceTracker.css';
import { ArrowUpRight, ArrowDownRight, Minus, Lock, ShieldCheck } from 'lucide-react';

const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 30500, change: 200, type: "Mandi", contact: "Raipur Ispat" },
  { id: 102, category: "Ferrous", material: "Sponge Iron", location: "Durgapur", price: 34000, change: -50, type: "Mandi", contact: "Durgapur Traders" },
  { id: 103, category: "Ferrous", material: "Sponge Iron", location: "Bellary", price: 32200, change: 0, type: "Mandi", contact: "Bellary Steels" },
  { id: 104, category: "Ferrous", material: "Melting Scrap", location: "Alang", price: 36500, change: 150, type: "HMS", contact: "Alang Recyclers" },
  { id: 201, category: "Non Ferrous", material: "Copper", location: "Delhi", price: 785, change: 5, type: "Millberry", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non Ferrous", material: "Copper", location: "Mumbai", price: 760, change: -2, type: "Armature", contact: "Mumbai Scrap Corp" },
  { id: 203, category: "Non Ferrous", material: "Aluminium", location: "Alang", price: 212, change: -1, type: "Wire", contact: "Gujarat Alloys" },
  { id: 204, category: "Non Ferrous", material: "Brass", location: "Jamnagar", price: 490, change: 0, type: "Honey", contact: "Jamnagar Brass" },
];

const PriceTracker = () => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [unlockedDetails, setUnlockedDetails] = useState({});

  // 1. Calculate Averages
  const materialAverages = useMemo(() => {
    const sums = {};
    const counts = {};
    MARKET_DATA.forEach(item => {
      if (!sums[item.material]) { sums[item.material] = 0; counts[item.material] = 0; }
      sums[item.material] += item.price;
      counts[item.material] += 1;
    });
    const avgs = {};
    for (const mat in sums) { avgs[mat] = sums[mat] / counts[mat]; }
    return avgs;
  }, []);

  // 2. Filter Data
  let processedData = MARKET_DATA.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const locationMatch = filterLocation === 'All' || item.location === filterLocation;
    return categoryMatch && locationMatch;
  });

  // 3. Sort Logic
  if (sortOrder === 'high-low') processedData.sort((a, b) => b.price - a.price);
  else if (sortOrder === 'low-high') processedData.sort((a, b) => a.price - b.price);

  const uniqueLocations = [...new Set(MARKET_DATA.map(item => item.location))];

  // Helper: Status Logic
  const getComparison = (item) => {
    const avg = materialAverages[item.material];
    const diff = item.price - avg;
    const threshold = avg * 0.02; 

    if (diff > threshold) return { text: 'High', color: 'text-red-600', needle: '45deg', label: 'Expensive' };
    if (diff < -threshold) return { text: 'Low', color: 'text-green-600', needle: '-45deg', label: 'Good Buy' };
    return { text: 'Avg', color: 'text-gray-500', needle: '0deg', label: 'Neutral' };
  };

  const handleUnlockPrice = (id) => {
    if (window.confirm("Unlock verified contact details for $5?")) {
      setTimeout(() => setUnlockedDetails(prev => ({ ...prev, [id]: true })), 500);
    }
  };

  return (
    <div className="price-tracker-page">
      <div className="pt-header">
        <h2>Live Market Intelligence</h2>
        <p>Real-time pricing compared against National Averages.</p>
        
        <div className="pt-controls">
          <div className="control-group">
            <select onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Ferrous">Ferrous</option>
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
            </select>
          </div>
        </div>
      </div>

      <div className="pt-grid">
        {processedData.map(item => {
          const { text, color, needle, label } = getComparison(item);
          return (
            <div key={item.id} className="pt-card">
              <div className="pt-card-top">
                <span className={`cat-badge ${item.category === 'Non Ferrous' ? 'nf' : 'fe'}`}>
                  {item.category}
                </span>
                <div className={`flex items-center gap-1 font-bold ${color} text-sm uppercase`}>
                   {text === 'High' ? <ArrowUpRight size={16}/> : (text === 'Low' ? <ArrowDownRight size={16}/> : <Minus size={16}/>)}
                   {label}
                </div>
              </div>

              <div className="pt-visuals">
                <div className="gauge-box">
                   <div className="gauge-arc"></div>
                   <div className="gauge-needle" style={{ transform: `translateX(-50%) rotate(${needle})` }}></div>
                   <div className={`gauge-dot ${text === 'Avg' ? 'bg-gray-400' : 'bg-orange'}`}></div>
                </div>
                
                <div className="price-block">
                  <h3>₹{item.price.toLocaleString()}</h3>
                  <p className="text-xs font-bold text-gray-400">Avg: ₹{Math.round(materialAverages[item.material]).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-info">
                <h4>{item.material}</h4>
                <p>Location: <strong>{item.location}</strong></p>
                <p className="spec-type">Type: {item.type}</p>
              </div>

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
          );
        })}
      </div>
    </div>
  );
};

export default PriceTracker;
