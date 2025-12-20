import React, { useState } from 'react';
import { 
  Hammer, ShieldCheck, Lock, ArrowRight, Building2, User, Unlock, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. DATA (Same structure as before)
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 32500, change: 200, type: "Mandi", contact: "Raipur Ispat Links" },
  { id: 102, category: "Ferrous", material: "Pig Iron Steel", location: "Durgapur", price: 41000, change: -150, type: "Steel", contact: "Durgapur Foundries" },
  { id: 103, category: "Ferrous", material: "Melting Scrap", location: "Alang", price: 36500, change: 150, type: "HMS", contact: "Alang Recyclers Assn" },
  { id: 201, category: "Non-Ferrous", material: "Copper Millberry", location: "Delhi", price: 785, change: 12, type: "Wire", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non-Ferrous", material: "Aluminium Wire", location: "Alang", price: 212, change: -3, type: "Scrap", contact: "Gujarat Alloys" },
  // Note: We are showing a preview here. Full list is on /tracker
];

const Home = () => {
  const navigate = useNavigate();
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);
  const [userRole, setUserRole] = useState('guest'); 

  // Handlers
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
      
      {/* 1. NEWSLETTER TICKER (Top) */}
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
            
            {/* Map through only the first 5 items for preview */}
            {MARKET_DATA.slice(0, 5).map((p) => (
               <div key={p.id} className="min-w-[320px] relative group border-4 border-platinum p-8 bg-white transition-all hover:border-navy hover:shadow-xl">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black uppercase text-navy">{p.material}</h3>
                  <div className={`flex items-center gap-1 font-bold ${p.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {p.change > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                     {Math.abs(p.change)}
                  </div>
                </div>
                
                <p className="text-sm font-bold text-steel uppercase mt-1 mb-4">{p.location} • {p.type}</p>
                <p className="text-5xl font-black text-navy tracking-tighter">₹{p.price.toLocaleString()}</p>
                
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

            {/* "SEE ALL" CARD AT THE END OF SCROLL */}
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

      {/* 4. E-AUCTION PORTAL (Same as before) */}
      <section id="auction" className="py-24 bg-navy text-white relative overflow-hidden">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Hammer size={400} />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">E-Auction <span className="text-orange">Portal</span></h2>
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            {/* AUCTIONEER LOGIC */}
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

            {/* BIDDER LOGIC */}
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
