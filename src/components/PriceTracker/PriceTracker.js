import React, { useState, useMemo } from 'react';
import { Filter, MapPin, ArrowUpDown, TrendingUp, Search } from 'lucide-react';
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import PriceCard from '../PriceCard'; 

// MOCK DATA
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "MS Scrap", form: "Attachment", grade: "Ship Breaking", location: "Alang", price: 33600, unit: "MT", change: 400, contact: "Alang Recyclers" },
  { id: 102, category: "Ferrous", material: "MS Scrap", form: "Tukdi", grade: "Ship Breaking", location: "Alang", price: 33400, unit: "MT", change: 200, contact: "Alang Recyclers" },
  { id: 103, category: "Ferrous", material: "HMS 1", form: "Bundle", grade: "80:20", location: "Mumbai", price: 34200, unit: "MT", change: -150, contact: "Mumbai Scrap Corp" },
  { id: 104, category: "Ferrous", material: "Sponge Iron", form: "Pellets", grade: "DRI-78", location: "Raipur", price: 30500, unit: "MT", change: 200, contact: "Raipur Ispat" },
  { id: 105, category: "Ferrous", material: "Sponge Iron", form: "Lumps", grade: "DRI-80", location: "Durgapur", price: 34000, unit: "MT", change: -50, contact: "Durgapur Traders" },
  { id: 201, category: "Non Ferrous", material: "Copper", form: "Wire Scrap", grade: "Millberry", location: "Delhi", price: 785000, unit: "MT", change: 5000, contact: "Delhi Metal Exch" },
  { id: 202, category: "Non Ferrous", material: "Aluminium", form: "Extrusion", grade: "6063", location: "Mumbai", price: 212000, unit: "MT", change: -1000, contact: "Gujarat Alloys" },
  { id: 203, category: "Non Ferrous", material: "Brass", form: "Honey", grade: "IS-319", location: "Jamnagar", price: 490000, unit: "MT", change: 0, contact: "Jamnagar Brass" },
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

  // 2. Filter & Sort Logic
  let processedData = MARKET_DATA.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const locationMatch = filterLocation === 'All' || item.location === filterLocation;
    return categoryMatch && locationMatch;
  });

  if (sortOrder === 'high-low') processedData.sort((a, b) => b.price - a.price);
  else if (sortOrder === 'low-high') processedData.sort((a, b) => a.price - b.price);

  const uniqueLocations = [...new Set(MARKET_DATA.map(item => item.location))].sort();

  const handleUnlockPrice = (id) => {
    if (window.confirm("Unlock verified contact details for $5?")) {
      setTimeout(() => setUnlockedDetails(prev => ({ ...prev, [id]: true })), 500);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col font-sans text-navy">
      <Header />
      
      {/* --- PAGE HEADER BANNER --- */}
      <div className="bg-navy text-white pt-10 pb-20 px-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 flex items-center justify-center md:justify-start gap-3">
                        <TrendingUp className="text-orange" size={32} /> Market Intelligence
                    </h1>
                    <p className="text-blue-100 font-medium text-sm md:text-base max-w-2xl">
                        Real-time scrap pricing across India. Verified mandi rates updated hourly.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
                    <span className="text-orange text-xs font-bold uppercase tracking-widest block">Live Updates</span>
                    <span className="text-white text-sm font-bold">Last Sync: Just Now</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 -mt-12 mb-12 relative z-20">
        
        {/* --- FILTERS BAR --- */}
        <div className="bg-white p-4 rounded-xl shadow-xl border-t-4 border-orange mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {/* Category Filter */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel group-focus-within:text-orange transition-colors">
                        <Filter size={16} />
                    </div>
                    <select 
                        onChange={(e) => setFilterCategory(e.target.value)} 
                        className="pl-10 pr-8 py-3 bg-platinum/30 border border-platinum rounded-lg text-sm font-bold text-navy focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none w-full md:w-48 appearance-none cursor-pointer hover:bg-platinum/50 transition-all"
                    >
                        <option value="All">All Categories</option>
                        <option value="Ferrous">Ferrous</option>
                        <option value="Non Ferrous">Non Ferrous</option>
                    </select>
                </div>

                {/* Location Filter */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel group-focus-within:text-orange transition-colors">
                        <MapPin size={16} />
                    </div>
                    <select 
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-platinum/30 border border-platinum rounded-lg text-sm font-bold text-navy focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none w-full md:w-48 appearance-none cursor-pointer hover:bg-platinum/50 transition-all"
                    >
                        <option value="All">All Locations</option>
                        {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
            </div>

            {/* Sort Control */}
            <div className="relative group w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel group-focus-within:text-orange transition-colors">
                    <ArrowUpDown size={16} />
                </div>
                <select 
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white border-2 border-platinum rounded-lg text-sm font-bold text-navy focus:border-navy outline-none w-full md:w-56 appearance-none cursor-pointer"
                >
                    <option value="default">Sort By: Default</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="low-high">Price: Low to High</option>
                </select>
            </div>
        </div>

        {/* --- DATA GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedData.length > 0 ? (
                processedData.map(item => (
                    <div key={item.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                        <PriceCard 
                            item={item}
                            averagePrice={materialAverages[item.material]}
                            isUnlocked={unlockedDetails[item.id]}
                            onUnlock={handleUnlockPrice}
                        />
                    </div>
                ))
            ) : (
                <div className="col-span-full bg-white p-12 rounded-xl shadow-sm border border-platinum text-center">
                    <div className="inline-block p-4 bg-platinum/50 rounded-full mb-4 text-steel">
                        <Search size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-navy uppercase">No Market Data Found</h3>
                    <p className="text-steel mt-2 text-sm">Try adjusting your filters to see more results.</p>
                    <button 
                        onClick={() => { setFilterCategory('All'); setFilterLocation('All'); }}
                        className="mt-6 px-6 py-2 bg-navy text-white rounded text-xs font-bold uppercase hover:bg-orange transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default PriceTracker;
