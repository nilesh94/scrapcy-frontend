import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuctionScrollCard from '../e-auction/components/AuctionScrollCard';

const AllAuctions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL'); 
  const [auctions, setAuctions] = useState([]);

  // MOCK_AUCTIONS used as fallback
  const MOCK_AUCTIONS = [
     { id: 3048, title: "Structural Steel Scrap", status: "LIVE", date: "26 Feb 2026", time: "04:00 PM", quantity: "500 MT", location: "Patna, Bihar" },
     { id: 3049, title: "Aluminium Extrusion 6063", status: "UPCOMING", date: "02 Mar 2026", time: "11:00 AM", quantity: "50 MT", location: "Mumbai, MH" },
     { id: 3040, title: "Copper Wire Millberry", status: "CLOSED", date: "15 Feb 2026", time: "10:00 AM", quantity: "10 MT", location: "Delhi" }
  ];

  // Fetch Real Data from Open API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/api/v1/e-auction/auctions/listing');
        if (response.data.auctions && response.data.auctions.length > 0) {
          const formatted = response.data.auctions.map(auc => ({
            id: auc.id,
            title: auc.auction_title,
            status: auc.status === 'SCHEDULED' ? 'UPCOMING' : auc.status, // Map SCHEDULED to UI UPCOMING tag
            date: new Date(auc.scheduled_start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(auc.scheduled_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: auc.region,
            quantity: auc.quantity || "TBD",
            items: auc.items || []
          }));
          setAuctions(formatted);
        } else {
          setAuctions(MOCK_AUCTIONS);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions(MOCK_AUCTIONS);
      }
    };
    fetchAuctions();
  }, []);

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
             <AuctionScrollCard 
               key={auc.id} 
               auction={auc} 
               onClick={() => navigate(`/api/v1/e-auction/auctions/listing/${auc.id}`)} 
             />
          ))}
        </div>
        
        {filteredAuctions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-steel font-bold text-xl uppercase">No auctions found for this category.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllAuctions;
