import React, { useState } from 'react';
import { Menu, X, Hammer, ShieldCheck, Mail, Lock, ArrowRight, Building2, User, Unlock } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // roles: guest, company, bidder
  
  // Logic for Unlocking Price Details
  const [unlockedDetails, setUnlockedDetails] = useState({});

  // Logic for Auction Deposits
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false);

  const prices = [
    { id: 1, metal: "Copper No.1", price: "$3.85/lb", change: "+1.2%", contact: "Global Copper Ltd - 987-654-3210" },
    { id: 2, metal: "Aluminum Siding", price: "$0.68/lb", change: "-0.5%", contact: "Alu-Recycle India - 888-222-1111" },
    { id: 3, metal: "HMS 1&2 Steel", price: "$380/MT", change: "+2.1%", contact: "Steel Yard Mumbai - 777-444-5555" },
    { id: 4, metal: "Yellow Brass", price: "$2.15/lb", change: "+0.4%", contact: "Brass Traders Inc - 666-999-0000" },
  ];

  const handleUnlockPrice = (id) => {
    alert("Redirecting to secure payment gateway for $5...");
    // Simulating a successful payment
    setTimeout(() => {
      setUnlockedDetails(prev => ({ ...prev, [id]: true }));
    }, 1000);
  };

  const handleAuctionDeposit = () => {
    alert("Redirecting to pay EMD (Earnest Money Deposit) of $500...");
    // Simulating a successful deposit
    setTimeout(() => {
      setHasPaidDeposit(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-platinum font-sans text-navy">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="bg-navy text-white sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter italic">SCRAP<span className="text-orange">CY</span></div>
          
          <div className="hidden md:flex space-x-8 font-bold uppercase text-xs tracking-widest">
            <a href="#home" className="hover:text-orange transition">Home</a>
            <a href="#prices" className="hover:text-orange transition">Market Prices</a>
            <a href="#auction" className="hover:text-orange transition">E-Auction</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] uppercase font-bold text-steel">Simulate Role:</span>
            <select 
              className="bg-steel text-white text-xs p-2 rounded outline-none border-none cursor-pointer"
              onChange={(e) => {
                setUserRole(e.target.value);
                setHasPaidDeposit(false); // Reset deposit status on role change
              }}
            >
              <option value="guest">Guest View</option>
              <option value="company">Company Owner</option>
              <option value="bidder">Bidder</option>
            </select>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- 2. SCROLLING NEWSLETTER --- */}
      <div className="bg-orange text-white py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <span key={i} className="mx-10 font-bold uppercase italic tracking-wider flex items-center gap-2">
              <Mail size={16}/> Join 10k+ Traders. Subscribe to the Scrapcy newsletter for daily price alerts!
            </span>
          ))}
        </div>
      </div>

      {/* --- 3. HERO SECTION --- */}
      <section id="home" className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic">Verified Marketplace</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 mt-2">
            The Hub of <br/>Scrap Metal
          </h1>
          <p className="text-lg text-steel font-medium mb-8 leading-relaxed">
            A premium, high-integrity platform bridging scrap producers and professional bidders. Verified data, secure payments, and transparent auctions.
          </p>
          <div className="flex gap-4">
            <button className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300">
              EXPLORE LISTINGS <ArrowRight size={20}/>
            </button>
          </div>
        </div>
        <div className="relative group overflow-hidden rounded-lg shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" 
            alt="Scrap Yard" 
            className="rounded grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
        </div>
      </section>

      {/* --- 4. MARKET TICKER (Pay-to-Unlock) --- */}
      <section id="prices" className="bg-white py-16 border-y border-platinum">
        <div className="max-w-7xl mx-auto px-4 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Market Price Ticker</h2>
            <p className="text-steel font-bold text-sm">Real-time benchmarks for active traders</p>
          </div>
          <span className="bg-red-600 text-white px-3 py-1 text-xs font-black animate-pulse rounded">● LIVE</span>
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
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 animate-fadeIn">
                  <p className="text-[10px] font-black uppercase text-green-700">Unlocked Contact:</p>
                  <p className="text-sm font-bold text-navy mt-1">{p.contact}</p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-navy/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                  <Lock className="text-orange mb-3" size={32} />
                  <p className="font-bold mb-4 text-sm px-4">Unlock direct buyer contact and source data for this metal.</p>
                  <button 
                    onClick={() => handleUnlockPrice(p.id)}
                    className="bg-orange hover:bg-white hover:text-orange w-full py-4 font-black uppercase text-xs transition-colors"
                  >
                    Unlock Details ($5)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. E-AUCTION PORTAL (Role-Based Logic) --- */}
      <section id="auction" className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* LEFT: INFO */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">E-Auction <br/><span className="text-orange">Portal</span></h2>
              <p className="text-steel text-lg mb-8">
                Access high-volume scrap lots. Secure, verified, and transparent. Every participant must pass mandatory verification and deposit checks.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-center p-4 bg-steel/10 border border-steel/20 rounded-lg">
                  <ShieldCheck className="text-orange" size={28}/>
                  <p className="text-sm font-bold">100% Verified Business Participants Only</p>
                </div>
                <div className="flex gap-4 items-center p-4 bg-steel/10 border border-steel/20 rounded-lg">
                  <Hammer className="text-orange" size={28}/>
                  <p className="text-sm font-bold">Live Transparent Bidding Engine</p>
                </div>
              </div>
            </div>

            {/* RIGHT: DYNAMIC ROLE VIEW */}
            <div className="bg-white text-navy p-10 rounded-2xl shadow-2xl relative">
              {userRole === 'guest' && (
                <div className="text-center py-10">
                  <Lock className="mx-auto text-orange mb-4" size={48} />
                  <h3 className="text-2xl font-black mb-2">RESTRICTED VIEW</h3>
                  <p className="text-steel font-medium mb-6">Please log in as a Company Owner or Bidder to access the portal.</p>
                  <button className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest">Login to Portal</button>
                </div>
              )}

              {userRole === 'company' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="text-orange" size={32} />
                    <h3 className="text-2xl font-black">AUCTIONEER CONSOLE</h3>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-platinum/30 rounded border border-platinum">
                      <p className="text-xs font-black text-steel uppercase">Quick Action</p>
                      <button className="mt-2 w-full bg-orange text-white py-3 font-black text-sm hover:scale-[1.02] transition-transform">POST NEW BULK LOT</button>
                    </div>
                    <div className="p-4 border border-platinum rounded hover:bg-platinum/10 transition cursor-pointer">
                      <p className="font-bold">Active Auctions (3)</p>
                    </div>
                  </div>
                </div>
              )}

              {userRole === 'bidder' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-orange" size={32} />
                    <h3 className="text-2xl font-black">BIDDER TERMINAL</h3>
                  </div>
                  
                  {!hasPaidDeposit ? (
                    <div className="p-6 bg-orange/5 border-2 border-dashed border-orange rounded-xl text-center">
                      <p className="font-bold mb-4">You must pay the $500 EMD (Earnest Money Deposit) to activate your bidding privileges.</p>
                      <button 
                        onClick={handleAuctionDeposit}
                        className="bg-navy text-white px-6 py-3 font-black text-sm w-full"
                      >
                        PAY DEPOSIT NOW
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-green-50 border-2 border-green-600 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 font-black mb-4">
                        <Unlock size={20}/> DEPOSIT VERIFIED
                      </div>
                      <p className="text-sm font-bold mb-6">You are cleared to bid on all active industrial lots.</p>
                      <button className="bg-green-600 text-white w-full py-4 font-black text-sm uppercase">ENTER LIVE BIDDING ROOM</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 text-center border-t-8 border-orange">
        <div className="text-2xl font-black text-white mb-4 italic uppercase">SCRAP<span className="text-orange">CY</span></div>
        <p className="text-steel font-bold tracking-[0.3em] text-[10px]">© 2025 INDUSTRIAL AUTHORITY | ALL RIGHTS RESERVED</p>
      </footer>

    </div>
  );
};

export default App;
