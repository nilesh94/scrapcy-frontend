import React, { useState } from 'react';
import { Menu, X, Hammer, ShieldCheck, TrendingUp, Mail, Lock, ArrowRight, Building2, User } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // roles: guest, company, bidder

  const prices = [
    { id: 1, metal: "Copper No.1", price: "$3.85/lb", change: "+1.2%" },
    { id: 2, metal: "Aluminum Siding", price: "$0.68/lb", change: "-0.5%" },
    { id: 3, metal: "HMS 1&2 Steel", price: "$380/MT", change: "+2.1%" },
    { id: 4, metal: "Yellow Brass", price: "$2.15/lb", change: "+0.4%" },
  ];

  return (
    <div className="min-h-screen bg-platinum font-sans text-navy">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="bg-navy text-white sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter">SCRAP<span className="text-orange">CY</span></div>
          
          <div className="hidden md:flex space-x-8 font-bold uppercase text-xs tracking-widest">
            <a href="#home" className="hover:text-orange transition">Home</a>
            <a href="#prices" className="hover:text-orange transition">Prices</a>
            <a href="#auction" className="hover:text-orange transition">E-Auction</a>
          </div>

          <div className="hidden md:flex gap-4">
            <select 
              className="bg-steel text-white text-xs p-2 rounded"
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="guest">View as Guest</option>
              <option value="company">Login as Company Owner</option>
              <option value="bidder">Login as Bidder</option>
            </select>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- 1.1 NEWSLETTER SCROLLING --- */}
      <div className="bg-orange text-white py-2 overflow-hidden border-y border-white/20">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <span key={i} className="mx-10 font-bold uppercase italic tracking-wider flex items-center gap-2">
              <Mail size={16}/> Subscribe to our newsletter for daily metal insights and market trends!
            </span>
          ))}
        </div>
      </div>

      {/* --- 1. HOME: COMPANY INFO --- */}
      <section id="home" className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic">Established 2025</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 mt-2">
            Global Metal <br/>Marketplace
          </h1>
          <p className="text-lg text-steel font-medium mb-8">
            Scrapcy is a high-integrity platform designed to bridge the gap between scrap producers and professional recyclers. We provide verified data, auction security, and direct buyer-seller connectivity.
          </p>
          <div className="flex gap-4">
            <button className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2">OUR SERVICES <ArrowRight size={20}/></button>
          </div>
        </div>
        <div className="bg-steel/10 rounded-lg p-4 border-2 border-steel/20">
          <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" alt="Scrap" className="rounded grayscale hover:grayscale-0 transition-all duration-500 shadow-xl"/>
        </div>
      </section>

      {/* --- 1.2 SCROLLING PRICE DETAILS (Hover for Details) --- */}
      <section id="prices" className="bg-white py-12 border-y border-platinum">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-end">
          <h2 className="text-3xl font-black uppercase italic">Live Market Ticker</h2>
          <span className="text-steel text-sm font-bold animate-pulse text-red-600">● LIVE</span>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 px-4 scrollbar-hide">
          {prices.map((p) => (
            <div key={p.id} className="min-w-[300px] relative group border-2 border-platinum p-8 bg-white transition-all hover:border-navy">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black uppercase">{p.metal}</h3>
                <span className={p.change.includes('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{p.change}</span>
              </div>
              <p className="text-4xl font-black mt-4 text-navy">{p.price}</p>
              
              {/* HOVER OVERLAY (PAID SERVICE) */}
              <div className="absolute inset-0 bg-navy/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center text-white">
                <Lock className="text-orange mb-3" size={32} />
                <p className="font-bold mb-4">Connect directly with verified buyers for this material.</p>
                <button className="bg-orange w-full py-3 font-black uppercase text-sm tracking-tighter">
                  Get Details ($)
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 2. E-AUCTION SECTION --- */}
      <section id="auction" className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">E-AUCTION PORTAL</h2>
            <p className="text-steel max-w-2xl mx-auto">The most secure way to trade scrap metal. 100% verified participants with mandatory token deposits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ROLE: COMPANY OWNER */}
            <div className={`p-10 border-2 rounded-xl transition-all ${userRole === 'company' ? 'border-orange bg-steel/20' : 'border-steel/30 opacity-60'}`}>
              <Building2 className="text-orange mb-4" size={48} />
              <h3 className="text-2xl font-black mb-4">FOR AUCTIONEERS</h3>
              <ul className="space-y-3 mb-8 text-platinum/80">
                <li className="flex gap-2"><ShieldCheck className="text-orange" size={20}/> Post unlimited bulk auctions</li>
                <li className="flex gap-2"><ShieldCheck className="text-orange" size={20}/> Real-time bidder verification</li>
                <li className="flex gap-2"><ShieldCheck className="text-orange" size={20}/> Dedicated management portal</li>
              </ul>
              {userRole === 'company' ? (
                <button className="w-full bg-orange py-4 font-black text-lg">CREATE NEW AUCTION</button>
              ) : (
                <p className="text-xs uppercase font-bold text-orange">Register as Company Owner to post</p>
              )}
            </div>

            {/* ROLE: BIDDER */}
            <div className={`p-10 border-2 rounded-xl transition-all ${userRole === 'bidder' ? 'border-orange bg-steel/20' : 'border-steel/30 opacity-60'}`}>
              <User className="text-orange mb-4" size={48} />
              <h3 className="text-2xl font-black mb-4">FOR BIDDERS</h3>
              <ul className="space-y-3 mb-8 text-platinum/80">
                <li className="flex gap-2"><Hammer className="text-orange" size={20}/> Access to exclusive bulk lots</li>
                <li className="flex gap-2"><Hammer className="text-orange" size={20}/> Token-based secure bidding</li>
                <li className="flex gap-2"><Hammer className="text-orange" size={20}/> Direct winner notification</li>
              </ul>
              {userRole === 'bidder' ? (
                <button className="w-full bg-orange py-4 font-black text-lg">BROWSE LIVE AUCTIONS</button>
              ) : (
                <p className="text-xs uppercase font-bold text-orange">Login as Bidder to participate</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-10 text-center border-t-4 border-orange">
        <p className="text-steel font-bold tracking-widest text-xs">© 2025 SCRAPCY PLATFORM | MOBILE RESPONSIVE UI</p>
      </footer>
    </div>
  );
};

export default App;
