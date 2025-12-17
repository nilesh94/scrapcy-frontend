import React, { useState } from 'react';
import { Hammer, ShieldCheck, Mail, Lock, ArrowRight, Building2, User, Unlock } from 'lucide-react';

const Home = () => {
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  const prices = [
    { id: 1, metal: "Copper No.1", price: "$3.85/lb", change: "+1.2%", contact: "Global Copper Ltd - 987-654-3210" },
    { id: 2, metal: "Aluminum Siding", price: "$0.68/lb", change: "-0.5%", contact: "Alu-Recycle India - 888-222-1111" },
    { id: 3, metal: "HMS 1&2 Steel", price: "$380/MT", change: "+2.1%", contact: "Steel Yard Mumbai - 777-444-5555" },
    { id: 4, metal: "Yellow Brass", price: "$2.15/lb", change: "+0.4%", contact: "Brass Traders Inc - 666-999-0000" },
  ];

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
    <main>
      {/* 1.1 NEWSLETTER SCROLLING */}
      <div className="bg-orange text-white py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <span key={i} className="mx-10 font-bold uppercase italic tracking-wider flex items-center gap-2">
              <Mail size={16}/> Subscribe for daily scrap metal price alerts!
            </span>
          ))}
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section id="home" className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic text-blue-900">Industrial Authority</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 mt-2">
            The Hub of <br/>Scrap Trade
          </h1>
          <p className="text-lg text-steel font-medium mb-8 leading-relaxed">
            A premium, high-integrity platform bridging scrap producers and professional bidders. Verified data and secure auctions.
          </p>
          <button className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300">
            EXPLORE LISTINGS <ArrowRight size={20}/>
          </button>
        </div>
        <div className="rounded-lg shadow-2xl overflow-hidden bg-steel/10 p-2">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" 
            alt="Scrap Yard" 
            className="rounded grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* 1.2 MARKET TICKER (Pay-to-Unlock) */}
      <section id="prices" className="bg-white py-16 border-y border-platinum">
        <div className="max-w-7xl mx-auto px-4 mb-10 flex justify-between items-end">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Live Scrap Ticker</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-steel">Test Role:</span>
            <select onChange={(e) => setUserRole(e.target.value)} className="text-xs border p-1 rounded">
                <option value="guest">Guest</option>
                <option value="company">Company</option>
                <option value="bidder">Bidder</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-10 px-4 scrollbar-hide">
          {prices.map((p) => (
            <div key={p.id} className="min-w-[320px] relative group border-4 border-platinum p-8 bg-white transition-all hover:border-navy">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black uppercase">{p.metal}</h3>
                <span className={p.change.includes('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{p.change}</span>
              </div>
              <p className="text-5xl font-black mt-4 text-navy tracking-tighter">{p.price}</p>
              
              {unlockedDetails[p.id] ? (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600">
                  <p className="text-[10px] font-black uppercase text-green-700">Verified Contact:</p>
                  <p className="text-sm font-bold text-navy mt-1">{p.contact}</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-navy/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Lock className="text-orange mb-3" size={32} />
                  <p className="font-bold mb-4 text-sm">Unlock contact details for $5</p>
                  <button 
                    onClick={() => handleUnlockPrice(p.id)}
                    className="bg-orange hover:bg-white hover:text-orange w-full py-3 font-black uppercase text-xs transition-colors"
                  >
                    Get Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. E-AUCTION PORTAL */}
      <section id="auction" className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">E-Auction <span className="text-orange">Access</span></h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* AUCTIONEER LOGIC */}
            <div className={`p-8 border-2 rounded-xl ${userRole === 'company' ? 'border-orange bg-steel/10' : 'border-steel/20 opacity-50'}`}>
              <Building2 className="text-orange mb-4" size={40} />
              <h3 className="text-xl font-black mb-4">FOR SELLERS</h3>
              <p className="text-sm text-platinum/70 mb-6">Post bulk auctions and manage bids from verified buyers.</p>
              {userRole === 'company' ? (
                <button className="bg-orange w-full py-4 font-black">POST NEW AUCTION</button>
              ) : (
                <button className="border border-white/30 w-full py-4 font-black text-xs cursor-not-allowed">REGISTER AS COMPANY</button>
              )}
            </div>

            {/* BIDDER LOGIC */}
            <div className={`p-8 border-2 rounded-xl ${userRole === 'bidder' ? 'border-orange bg-steel/10' : 'border-steel/20 opacity-50'}`}>
              <User className="text-orange mb-4" size={40} />
              <h3 className="text-xl font-black mb-4">FOR BIDDERS</h3>
              <p className="text-sm text-platinum/70 mb-6">Bid on verified industrial lots after token deposit.</p>
              {userRole === 'bidder' ? (
                !hasPaidDeposit ? (
                    <button onClick={handleAuctionDeposit} className="bg-orange w-full py-4 font-black">PAY $500 DEPOSIT</button>
                ) : (
                    <button className="bg-green-600 w-full py-4 font-black">ENTER BIDDING ROOM</button>
                )
              ) : (
                <button className="border border-white/30 w-full py-4 font-black text-xs cursor-not-allowed">REGISTER AS BIDDER</button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
