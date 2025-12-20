import React, { useState, useMemo } from 'react';
import { 
  Hammer, Lock, ArrowRight, Building2, User, Unlock, ArrowUpRight, ArrowDownRight, Minus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. DATA
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 30500, change: 200, type: "Mandi", contact: "Raipur Ispat Links" },
  { id: 102, category: "Ferrous", material: "Sponge Iron", location: "Durgapur", price: 34000, change: -150, type: "Mandi", contact: "Durgapur Foundries" },
  { id: 103, category: "Ferrous", material: "Sponge Iron", location: "Bellary", price: 32200, change: 0, type: "Mandi", contact: "Bellary Steels" },
  { id: 201, category: "Non-Ferrous", material: "Copper", location: "Delhi", price: 785, change: 12, type: "Millberry", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non-Ferrous", material: "Copper", location: "Mumbai", price: 760, change: -5, type: "Armature", contact: "Mumbai Scrap Corp" },
  { id: 203, category: "Non-Ferrous", material: "Aluminium", location: "Alang", price: 212, change: -3, type: "Wire", contact: "Gujarat Alloys" },
];

const Home = () => {
  const navigate = useNavigate();
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);
  const [userRole, setUserRole] = useState('guest'); 

  // --- LOGIC TO CALCULATE AVERAGES ---
  const materialAverages = useMemo(() => {
    const sums = {};
    const counts = {};
    
    MARKET_DATA.forEach(item => {
      if (!sums[item.material]) { sums[item.material] = 0; counts[item.material] = 0; }
      sums[item.material] += item.price;
      counts[item.material] += 1;
    });

    const avgs = {};
    for (const mat in sums) {
      avgs[mat] = sums[mat] / counts[mat];
    }
    return avgs;
  }, []);

  const getPriceComparison = (item) => {
    const avg = materialAverages[item.material];
    const diff = item.price - avg;
    const threshold = avg * 0.02; // 2% buffer for "Average" status

    if (diff > threshold) return { status: 'High', color: 'text-red-600', icon: <ArrowUpRight size={18}/>, needle: '45deg' }; // Expensive
    if (diff < -threshold) return { status: 'Low', color: 'text-green-600', icon: <ArrowDownRight size={18}/>, needle: '-45deg' }; // Cheap (Good Buy)
    return { status: 'Avg', color: 'text-gray-500', icon: <Minus size={18}/>, needle: '0deg' }; // Neutral
  };

  // Handlers
  const handleUnlockPrice = (id) => {
    if (window.confirm("Unlock verified contact details for $5?")) {
      setTimeout(() => setUnlockedDetails(prev => ({ ...prev, [id]: true })), 500);
    }
  };

  const handleAuctionDeposit = () => {
    if (window.confirm("Pay refundable $500 Earnest Money Deposit?")) {
      setHasPaidDeposit(true);
    }
  };

  return (
    <main className="bg-platinum min-h-screen">
      
      {/* 1. NEWSLETTER TICKER */}
      <div className="bg-orange text-white py-2 overflow-hidden border-b-4 border-navy">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => {
            const { status } = getPriceComparison(item);
            return (
              <span key={i} className="mx-8 font-bold uppercase italic tracking-wider flex items-center gap-2 text-sm">
                <span className="text-navy">LIVE:</span> {item.material} ({item.location}) 
                <span className={status === 'Low' ? 'text-green-100' : (status === 'High' ? 'text-red-100' : 'text-gray-200')}>
                  {item.price.toLocaleString()} ({status})
                </span>
              </span>
            );
          })}
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
            {/* VIEW FULL DASHBOARD BUTTON REMOVED */}
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
               <h2 className="text-3xl font-black uppercase italic tracking-tighter text-navy">Regional Price Comparison</h2>
               <p className="text-steel font-medium">Comparing prices against National Average</p>
            </div>
            
            <button 
              onClick={() => navigate('/tracker')} 
              className="flex items-center gap-2 text-orange font-black uppercase hover:text-navy transition-colors border-b-2 border-orange pb-1"
            >
              See All Markets <ArrowRight size={18} />
            </button>
          </div>

          {/* HORIZONTAL SCROLL CONTAINER */}
          <div className="flex gap-6 overflow-x-auto pb-10 px-2 scrollbar-hide">
            
            {MARKET_DATA.slice(0, 6).map((p) => {
               const { status, color, icon, needle } = getPriceComparison(p);
               
               return (
                <div key={p.id} className="min-w-[320px] relative group border-4 border-platinum p-8 bg-white transition-all hover:border-navy hover:shadow-xl">
                  
                  {/* 1. Header with Comparison Logic */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black uppercase text-navy">{p.material}</h3>
                    <div className={`flex items-center gap-1 font-bold ${color} bg-gray-50 px-2 py-1 rounded text-xs uppercase tracking-wider`}>
                       {icon} {status}
                    </div>
                  </div>
                  
                  <p className="text-sm font-bold text-steel uppercase mt-1 mb-4">{p.location} • {p.type}</p>
                  
                  {/* 2. Gauge Visualization */}
                  <div className="flex justify-center my-6 opacity-80 group-hover:opacity-100 transition-opacity">
                     <div className="relative w-24 h-12 overflow-hidden">
                        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-[6px] border-platinum border-b-transparent"></div>
                        <div 
                           className="absolute bottom-0 left-1/2 w-1 h-12 bg-navy origin-bottom transition-transform duration-700 ease-out"
                           style={{ transform: `translateX(-50%) rotate(${needle})` }}
                        ></div>
                        <div className={`absolute bottom-0 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 translate-y-1/2 ${status === 'Avg' ? 'bg-gray-400' : 'bg-orange'}`}></div>
                     </div>
                  </div>

                  <p className="text-5xl font-black text-navy tracking-tighter text-center">₹{p.price.toLocaleString()}</p>
                  <p className="text-center text-xs text-steel font-bold mt-2">Daily Change: {p.change > 0 ? '+' : ''}{p.change}</p>
                  
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
               );
            })}

            <div 
              onClick={() => navigate('/tracker')}
              className="min-w-[320px] border-4 border-dashed border-platinum bg-platinum/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange hover:bg-orange/5 transition-all group"
            >
              <div className="p-4 rounded-full bg-white border-2 border-platinum group-hover:border-orange mb-4">
                <ArrowRight size={32} className="text-steel group-hover:text-orange" />
              </div>
              <h3 className="text-xl font-black uppercase text-navy">View All Prices</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. E-AUCTION PORTAL */}
      <section id="auction" className="py-24 bg-navy text-white relative overflow-hidden">
        {/* Background Icon */}
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
