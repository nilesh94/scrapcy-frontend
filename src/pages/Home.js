import React, { useState } from 'react';
import { 
  Hammer, ShieldCheck, Lock, ArrowRight, Building2, User, Unlock, 
  ArrowUpRight, ArrowDownRight, Minus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. DATA (With examples of +, -, and 0 change)
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi", contact: "Raipur Ispat Links" },
  { id: 102, category: "Ferrous", material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel", contact: "Durgapur Foundries" },
  { id: 103, category: "Ferrous", material: "Pig Iron Foundry", location: "Ahmedabad", price: 42100, change: 0, type: "Foundry", contact: "Gujarat Iron Traders" }, // NEUTRAL EXAMPLE
  { id: 201, category: "Non-Ferrous", material: "Copper Millberry", location: "Delhi", price: 785, change: 12, type: "Wire", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non-Ferrous", material: "Aluminium Wire", location: "Alang", price: 212, change: -3, type: "Scrap", contact: "Gujarat Alloys" },
  { id: 203, category: "Non-Ferrous", material: "Brass Honey", location: "Jamnagar", price: 490, change: 0, type: "Honey", contact: "Jamnagar Brass Corp" }, // NEUTRAL EXAMPLE
];

const Home = () => {
  const navigate = useNavigate();
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);
  const [userRole, setUserRole] = useState('guest'); 

  // --- HELPER FUNCTIONS FOR COLOR CODING ---
  
  // 1. Get Color Class
  const getStatusColor = (change) => {
    if (change > 0) return 'text-green-600'; // High
    if (change < 0) return 'text-red-600';   // Low
    return 'text-gray-500';                  // Neutral
  };

  // 2. Get Icon
  const getStatusIcon = (change) => {
    if (change > 0) return <ArrowUpRight size={18} />;
    if (change < 0) return <ArrowDownRight size={18} />;
    return <Minus size={18} />;
  };

  // 3. Get Needle Rotation for Gauge
  const getNeedleRotation = (change) => {
    if (change > 0) return '45deg';  // Point Right
    if (change < 0) return '-45deg'; // Point Left
    return '0deg';                   // Point Straight Up
  };

  // --- ACTIONS ---
  const handleUnlockPrice = (id) => {
    const confirmUnlock = window.confirm("Unlock verified contact details for $5?");
    if (confirmUnlock) {
      setTimeout(() => {
        setUnlockedDetails(prev => ({ ...prev, [id]: true }));
      }, 500);
    }
  };

  const handleAuctionDeposit = () => {
    const confirmDeposit = window.confirm("Pay refundable $500 Earnest Money Deposit?");
    if (confirmDeposit) {
      setHasPaidDeposit(true);
    }
  };

  return (
    <main className="bg-platinum min-h-screen">
      
      {/* 1. NEWSLETTER TICKER */}
      <div className="bg-orange text-white py-2 overflow-hidden border-b-4 border-navy">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => (
            <span key={i} className="mx-8 font-bold uppercase italic tracking-wider flex items-center gap-2 text-sm">
              <span className="text-navy">LIVE:</span> {item.material} ({item.location}) 
              <span className={item.change === 0 ? "text-gray-300" : (item.change > 0 ? "text-green-100" : "text-red-100")}>
                {item.change > 0 ? "▲" : (item.change < 0 ? "▼" : "—")} {Math.abs(item.change)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic">Industrial Authority</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 mt-2 text-navy">
            The Hub of <br/>Scrap Trade
          </h1>
          <p className="text-lg text-steel font-medium mb-8 leading-relaxed">
            A premium, high-integrity platform bridging scrap producers and professional bidders. Verified data and secure auctions.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => document.getElementById('prices').scrollIntoView({ behavior: 'smooth' })}
              className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300 shadow-lg shadow-navy/20"
            >
              EXPLORE MARKET <ArrowRight size={20}/>
            </button>
            <button 
              onClick={() => navigate('/tracker')}
              className="border-2 border-navy text-navy px-8 py-4 font-bold hover:bg-navy hover:text-white transition-all duration-300"
            >
              VIEW FULL DASHBOARD
            </button>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="rounded-lg shadow-2xl overflow-hidden bg-steel/10 p-2 border border-platinum-dark">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" 
            alt="Industrial Scrap Yard" 
            className="rounded grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. MARKET PRICES (Horizontal Scrolling) */}
      <section id="prices" className="bg-white py-16 border-y-4 border-platinum">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl font-black uppercase italic tracking-tighter text-navy">Live Scrap Ticker</h2>
               <p className="text-steel font-medium">Real-time prices (Horizontal Scroll)</p>
            </div>
            
            {/* SEE ALL LINK */}
            <button 
              onClick={() => navigate('/tracker')} 
              className="flex items-center gap-2 text-orange font-black uppercase hover:text-navy transition-colors border-b-2 border-orange pb-1"
            >
              See All Markets <ArrowRight size={18} />
            </button>
          </div>

          {/* HORIZONTAL SCROLL CONTAINER */}
          <div className="flex gap-6 overflow-x-auto pb-10 px-2 scrollbar-hide">
            
            {/* Limit to first 6 items */}
            {MARKET_DATA.slice(0, 6).map((p) => (
               <div key={p.id} className="min-w-[320px] relative group border-4 border-platinum p-8 bg-white transition-all hover:border-navy hover:shadow-xl">
                
                {/* 1. Header with Dynamic Color & Icon */}
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black uppercase text-navy">{p.material}</h3>
                  <div className={`flex items-center gap-1 font-bold ${getStatusColor(p.change)}`}>
                     {getStatusIcon(p.change)}
                     {Math.abs(p.change)}
                  </div>
                </div>
                
                <p className="text-sm font-bold text-steel uppercase mt-1 mb-4">{p.location} • {p.type}</p>
                
                {/* 2. Gauge Visualization */}
                <div className="flex justify-center my-6 opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="relative w-24 h-12 overflow-hidden">
                      {/* Gauge Background */}
                      <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-[6px] border-platinum border-b-transparent"></div>
                      
                      {/* Dynamic Needle */}
                      <div 
                         className="absolute bottom-0 left-1/2 w-1 h-12 bg-navy origin-bottom transition-transform duration-700 ease-out"
                         style={{ transform: `translateX(-50%) rotate(${getNeedleRotation(p.change)})` }}
                      ></div>
                      
                      {/* Center Dot */}
                      <div className={`absolute bottom-0 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 translate-y-1/2 ${p.change === 0 ? 'bg-gray-400' : 'bg-orange'}`}></div>
                   </div>
                </div>

                <p className="text-5xl font-black text-navy tracking-tighter text-center">₹{p.price.toLocaleString()}</p>
                
                {unlockedDetails[p.id] ? (
                  <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600">
                    <p className="text-[10px] font-black uppercase text-green-700">Verified Contact:</p>
                    <p className="text-sm font-bold text-navy mt-1">{p.contact}</p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <button 
                      onClick={() => handleUnlockPrice(p.id)}
                      className="bg-orange hover:bg-navy text-white w-full py-3 font-black uppercase text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock size={14} /> Unlock ($5)
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* "SEE ALL" CARD AT THE END */}
            <div 
              onClick={() => navigate('/tracker')}
              className="min-w-[320px] border-4 border-dashed border-platinum bg-platinum/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange hover:bg-orange/5 transition-all group"
            >
              <div className="p-4 rounded-full bg-white border-2 border-platinum group-hover:border-orange mb-4">
                <ArrowRight size={32} className="text-steel group-hover:text-orange" />
              </div>
              <h3 className="text-xl font-black uppercase text-navy">View All Prices</h3>
              <p className="text-steel font-medium text-sm">Access full dashboard</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. E-AUCTION PORTAL */}
      <section id="auction" className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Hammer size={400} />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">E-Auction <span className="text-orange">Portal</span></h2>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'company' ? 'border-orange bg-white/5' : 'border-white/10 opacity-80'}`}>
              <Building2 className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR SELLERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Post bulk auctions and manage inventory.</p>
              {userRole === 'company' ? (
                <button className="bg-orange text-white w-full py-4 font-black uppercase">Post Auction</button>
              ) : (
                <button onClick={() => setUserRole('company')} className="border border-white/20 w-full py-4 text-xs font-bold hover:bg-white/10">REGISTER AS SELLER</button>
              )}
            </div>

            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'bidder' ? 'border-orange bg-white/5' : 'border-white/10 opacity-80'}`}>
              <User className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR BIDDERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Access premium lots. Requires EMD.</p>
              {userRole === 'bidder' ? (
                !hasPaidDeposit ? (
                    <button onClick={handleAuctionDeposit} className="bg-orange text-white w-full py-4 font-black uppercase">Pay Deposit</button>
                ) : (
                    <button className="bg-green-600 text-white w-full py-4 font-black uppercase flex justify-center gap-2"><Unlock size={18}/> Enter Room</button>
                )
              ) : (
                <button onClick={() => setUserRole('bidder')} className="border border-white/20 w-full py-4 text-xs font-bold hover:bg-white/10">REGISTER AS BIDDER</button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
