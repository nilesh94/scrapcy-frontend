import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuctionScrollCard from '../e-auction/components/AuctionScrollCard';

const AllAuctions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL'); 

  // MOCK_AUCTIONS would ideally come from a shared constants file
  const auctions = [
     { id: 3048, title: "Structural Steel Scrap", status: "LIVE", date: "26 Feb 2026", time: "04:00 PM", quantity: "500 MT", location: "Patna, Bihar" },
     { id: 3049, title: "Aluminium Extrusion 6063", status: "UPCOMING", date: "02 Mar 2026", time: "11:00 AM", quantity: "50 MT", location: "Mumbai, MH" },
     { id: 3040, title: "Copper Wire Millberry", status: "CLOSED", date: "15 Feb 2026", time: "10:00 AM", quantity: "10 MT", location: "Delhi" }
  ];

  const filteredAuctions = filter === 'ALL' ? auctions : auctions.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-5xl font-black text-navy uppercase mb-8 italic tracking-tighter">Auction Directory</h1>
        
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {['ALL', 'LIVE', 'UPCOMING', 'CLOSED'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                filter === f ? 'bg-orange text-white shadow-lg' : 'bg-white text-navy border border-platinum'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAuctions.map(auc => (
             <AuctionScrollCard key={auc.id} auction={auc} onClick={() => navigate(`/api/v1/e-auction/auctions/listing/${auc.id}`)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllAuctions;
