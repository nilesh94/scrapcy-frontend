import React from 'react';
import { Hammer, Clock, Mail } from 'lucide-react';

const Auction = () => {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Background Element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Hammer size={600} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto border-4 border-orange p-10 bg-navy/80 backdrop-blur-sm rounded-xl shadow-2xl">
        
        <div className="flex justify-center mb-6">
           <div className="bg-orange p-4 rounded-full animate-bounce">
              <Clock size={48} className="text-white" />
           </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
          Auction <span className="text-orange">Portal</span>
        </h1>
        
        <h2 className="text-2xl font-bold text-platinum mb-8 uppercase tracking-widest">
          Coming Soon
        </h2>

        <p className="text-steel text-lg mb-10 leading-relaxed">
          We are building a secure, transparent, and real-time bidding engine for industrial scrap. Verified sellers and pre-screened bidders will soon connect here.
        </p>

        {/* Notify Form */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input 
            type="email" 
            placeholder="Enter your email for updates" 
            className="px-6 py-4 bg-white/10 border border-steel text-white placeholder-steel focus:outline-none focus:border-orange rounded"
          />
          <button className="bg-orange text-white px-8 py-4 font-black uppercase hover:bg-white hover:text-navy transition-colors flex items-center justify-center gap-2">
            <Mail size={18} /> Notify Me
          </button>
        </div>

      </div>

      {/* UPDATED FOOTER */}
      <footer className="absolute bottom-10 text-center">
        <p className="text-steel text-xs font-bold tracking-widest uppercase mb-1">
          Scrapcy E-Auction Platform
        </p>
        <p className="text-white/20 text-[10px] uppercase tracking-wider">
           A Venture by <span className="text-orange">Metanexus</span>
        </p>
      </footer>
    </div>
  );
};

export default Auction;
