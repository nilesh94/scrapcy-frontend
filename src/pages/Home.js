import React, { useState, useMemo } from 'react';
import { Hammer, ShieldCheck, Mail, Lock, ArrowRight, Building2, User, Unlock, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// 1. DATA FROM EXCEL SHEET (Integrated)
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi", contact: "Raipur Ispat Links - 998-877-6655" },
  { id: 102, category: "Ferrous", material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel", contact: "Durgapur Foundries - 887-776-6655" },
  { id: 103, category: "Ferrous", material: "Melting Scrap", location: "Alang", price: 36500, change: 150, type: "HMS", contact: "Alang Recyclers Assn - 776-665-5544" },
  { id: 201, category: "Non-Ferrous", material: "Copper Millberry", location: "Delhi", price: 785, change: 12, type: "Wire", contact: "Delhi Metal Exch - 999-000-1122" },
  { id: 202, category: "Non-Ferrous", material: "Aluminium Wire", location: "Alang", price: 212, change: -3, type: "Scrap", contact: "Gujarat Alloys - 888-111-2233" },
  { id: 203, category: "Non-Ferrous", material: "Brass Honey", location: "Jamnagar", price: 490, change: 5, type: "Honey", contact: "Jamnagar Brass Corp - 777-222-3344" },
];

const Home = () => {
  // State for UI Logic
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  // State for Dashboard Logic
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  // Filter Logic
  const filteredPrices = useMemo(() => {
    return MARKET_DATA.filter(item => {
      const catMatch = filterCategory === 'All' || item.category === filterCategory;
      const locMatch = filterLocation === 'All' || item.location === filterLocation;
      return catMatch && locMatch;
    });
  }, [filterCategory, filterLocation]);

  // Unique Locations for Dropdown
  const uniqueLocations = [...new Set(MARKET_DATA.map(item => item.location))];

  // Actions
  const handleUnlockPrice = (id) => {
    alert("Redirecting to secure payment gateway for $5...");
    setTimeout(() => {
      setUnlockedDetails(prev => ({ ...prev, [id]: true }));
    }, 1000);
  };

  const handleAuctionDeposit = () => {
    alert("Redirecting to pay EMD (Earnest Money Deposit) of $500...");
    setTimeout(() => {
      setHasPaidDeposit(true);
    }, 1000);
  };

  return (
    <main className="bg-white">
      {/* 1. NEWSLETTER SCROLLING */}
      <div className="bg-orange text-white py-2 overflow-hidden border-b-4 border-navy">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => (
            <span key={i} className="mx-8 font-bold uppercase italic tracking-wider flex items-center gap-2 text-sm">
              <span className="text-navy">LIVE:</span> {item.material} ({item.location}) 
              <span className={item.change > 0 ? "text-green-100" : "text-red-100"}>
                {item.change > 0 ? "▲" : "▼"} {Math.abs(item.change)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section id="home" className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic">Industrial Authority</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 mt-2 text-navy">
            The Hub of <br/>Scrap Trade
          </h1>
          <p className="text-lg text-steel font-medium mb-8 leading-relaxed">
            A premium, high-integrity platform bridging scrap producers and professional bidders. Verified data and secure auctions.
          </p>
          <button className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300 shadow-lg shadow-navy/20">
            EXPLORE LISTINGS <ArrowRight size={20}/>
          </button>
        </div>
        <div className="rounded-lg shadow-2xl overflow-hidden bg-steel/10 p-2 border border-platinum">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" 
            alt="Scrap Yard" 
            className="rounded grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. MARKET INTELLIGENCE DASHBOARD (Updated Grid) */}
      <section id="prices" className="bg-platinum/20 py-20 border-y border-platinum relative">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-navy">Market Intelligence</h2>
              <p className="text-steel font-medium mt-2">Real-time pricing from major Indian Mandis.</p>
            </div>
            
            {/* Dashboard Controls */}
            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-lg border border-platinum">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-orange" />
                <span className="text-xs font-bold text-navy uppercase">Filters:</span>
              </div>
              
              <select 
                className="text-sm font-bold text-navy bg-platinum/30 border-none rounded px-3 py-2 cursor-pointer focus:ring-2 focus:ring-orange outline-none"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Ferrous">Ferrous</option>
                <option value="Non-Ferrous">Non-Ferrous</option>
              </select>

              <select 
                className="text-sm font-bold text-navy bg-platinum/30 border-none rounded px-3 py-2 cursor-pointer focus:ring-2 focus:ring-orange outline-none"
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="All">All Locations</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>

              {/* Role Switcher (For Testing) */}
              <div className="flex items-center gap-2 pl-4 border-l border-platinum">
                <span className="text-xs font-bold text-steel">Role:</span>
                <select onChange={(e) => setUserRole(e.target.value)} className="text-xs border p-1 rounded">
                    <option value="guest">Guest</option>
                    <option value="company">Company</option>
                    <option value="bidder">Bidder</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrices.map((p) => (
              <div key={p.id} className="relative group bg-white border-2 border-platinum hover:border-navy transition-all duration-300 shadow-xl hover:shadow-2xl rounded-xl overflow-hidden">
                
                {/* Card Header */}
                <div className="p-6 pb-0 flex justify-between items-start">
                  <span className="bg-navy text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {p.location}
                  </span>
                  <div className={`flex items-center gap-1 font-bold ${p.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {p.change > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    {Math.abs(p.change)}
                  </div>
                </div>

                {/* Gauge Visual */}
                <div className="px-6 pt-4 pb-0 flex justify-center">
                  <div className="relative w-32 h-16 overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[6px] border-platinum border-b-transparent"></div>
                    {/* Dynamic needle rotation based on change */}
                    <div 
                      className="absolute bottom-0 left-1/2 w-1 h-16 bg-navy origin-bottom transition-transform duration-1000"
                      style={{ transform: `translateX(-50%) rotate(${p.change > 0 ? '45deg' : '-45deg'})` }}
                    ></div>
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-orange rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center px-6 pb-6">
                   <h3 className="text-3xl font-black text-navy tracking-tighter">₹{p.price.toLocaleString()}</h3>
                   <p className="text-sm font-bold text-steel uppercase mt-1">{p.material}</p>
                   <p className="text-xs text-platinum-dark font-medium">{p.category} • {p.type}</p>
                </div>
                
                {/* Unlock / Details Section */}
                <div className="border-t-2 border-platinum bg-platinum/10">
                  {unlockedDetails[p.id] ? (
                    <div className="p-4 bg-green-50 animate-fadeIn">
                      <p className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
                        <ShieldCheck size={12}/> Verified Source:
                      </p>
                      <p className="text-sm font-bold text-navy mt-1">{p.contact}</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleUnlockPrice(p.id)}
                      className="w-full py-4 flex items-center justify-center gap-2 text-navy font-black uppercase text-xs hover:bg-orange hover:text-white transition-colors group-hover:bg-navy group-hover:text-white"
                    >
                      <Lock size={14} className="text-orange group-hover:text-white" /> 
                      Unlock Details ($5)
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {filteredPrices.length === 0 && (
             <div className="text-center py-20 text-steel">
                <p className="text-xl font-bold">No materials found.</p>
                <p>Try adjusting your filters.</p>
             </div>
          )}

        </div>
      </section>

      {/* 4. E-AUCTION PORTAL */}
      <section id="auction" className="py-24 bg-navy text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Hammer size={400} />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">E-Auction <span className="text-orange">Portal</span></h2>
          <p className="text-platinum/60 mb-12 max-w-2xl mx-auto">Secure, transparent bidding for industrial lots. Verified sellers, pre-screened buyers.</p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* AUCTIONEER LOGIC */}
            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'company' ? 'border-orange bg-white/5 shadow-2xl shadow-orange/10' : 'border-white/10 opacity-60'}`}>
              <Building2 className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR SELLERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Post bulk auctions, manage inventory, and receive automated bid sheets.</p>
              {userRole === 'company' ? (
                <button className="bg-orange text-white hover:bg-white hover:text-navy w-full py-4 font-black uppercase tracking-widest transition-colors">
                    Post New Auction
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-platinum/40 border border-white/10 p-4 rounded justify-center">
                    <Lock size={12} /> REGISTER AS COMPANY TO ACCESS
                </div>
              )}
            </div>

            {/* BIDDER LOGIC */}
            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'bidder' ? 'border-orange bg-white/5 shadow-2xl shadow-orange/10' : 'border-white/10 opacity-60'}`}>
              <User className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR BIDDERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Access premium lots. Requires refundable EMD (Earnest Money Deposit).</p>
              {userRole === 'bidder' ? (
                !hasPaidDeposit ? (
                    <button onClick={handleAuctionDeposit} className="bg-orange text-white hover:bg-white hover:text-navy w-full py-4 font-black uppercase tracking-widest transition-colors flex justify-center gap-2">
                         Pay $500 Deposit
                    </button>
                ) : (
                    <button className="bg-green-600 text-white w-full py-4 font-black uppercase tracking-widest flex justify-center gap-2 items-center">
                         <Unlock size={18} /> Enter Bidding Room
                    </button>
                )
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-platinum/40 border border-white/10 p-4 rounded justify-center">
                    <Lock size={12} /> REGISTER AS BIDDER TO ACCESS
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
