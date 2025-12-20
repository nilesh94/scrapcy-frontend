import React, { useState, useMemo } from 'react';
import './PriceTracker.css';
import PriceCard from '../PriceCard'; // Import Check

// SAME MOCK DATA STRUCTURE AS HOME.JS
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
    const sums = {}; const counts = {};
    MARKET_DATA.forEach(item => {
      if (!sums[item.material]) { sums[item.material] = 0; counts[item.material] = 0; }
      sums[item.material] += item.price;
      counts[item.material] += 1;
    });
    const avgs = {};
    for (const mat in sums) avgs[mat] = sums[mat] / counts[mat];
    return avgs;
  }, []);

  // 2. Filter & Sort
  let processedData = MARKET_DATA.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const locationMatch = filterLocation === 'All' || item.location === filterLocation;
    return categoryMatch && locationMatch;
  });

  if (sortOrder === 'high-low') processedData.sort((a, b) => b.price - a.price);
  else if (sortOrder === 'low-high') processedData.sort((a, b) => a.price - b.price);

  const uniqueLocations = [...new Set(MARKET_DATA.map(item => item.location))];

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
        {processedData.map(item => (
            <PriceCard 
                key={item.id}
                item={item}
                averagePrice={materialAverages[item.material]}
                isUnlocked={unlockedDetails[item.id]}
                onUnlock={handleUnlockPrice}
            />
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;
