import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuctionScrollCard from '../e-auction/components/AuctionScrollCard';
import { Hammer, Filter, RotateCcw } from 'lucide-react';

const AllAuctions = () => {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- FILTER STATES ---
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // MOCK_AUCTIONS fallback
  const MOCK_AUCTIONS = [
     { id: 3048, title: "Structural Steel Scrap", status: "LIVE", date: "26 Feb 2026", time: "04:00 PM", quantity: "500 MT", location: "Patna, Bihar", category: "Steel" },
     { id: 3049, title: "Aluminium Extrusion 6063", status: "UPCOMING", date: "02 Mar 2026", time: "11:00 AM", quantity: "50 MT", location: "Mumbai, MH", category: "Aluminium" },
     { id: 3040, title: "Copper Wire Millberry", status: "CLOSED", date: "15 Feb 2026", time: "10:00 AM", quantity: "10 MT", location: "Delhi", category: "Copper" }
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/api/v1/e-auction/auctions/listing');
        if (response.data.auctions && response.data.auctions.length > 0) {
          const formatted = response.data.auctions.map(auc => ({
            id: auc.id,
            title: auc.auction_title,
            status: auc.status === 'SCHEDULED' ? 'UPCOMING' : auc.status,
            date: new Date(auc.scheduled_start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(auc.scheduled_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: auc.region,
            category: auc.category,
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // --- DYNAMIC FILTER OPTIONS ---
  const categories = useMemo(() => ['ALL', ...new Set(auctions.map(a => a.category))].filter(Boolean), [auctions]);
  const regions = useMemo(() => ['ALL', ...new Set(auctions.map(a => a.location))].filter(Boolean), [auctions]);

  // --- FILTERING LOGIC ---
  const filteredAuctions = auctions.filter(auc => {
    const matchStatus = statusFilter === 'ALL' || auc.status === statusFilter;
    const matchMaterial = materialFilter === 'ALL' || auc.category === materialFilter;
    const matchRegion = regionFilter === 'ALL' || auc.location === regionFilter;
    return matchStatus && matchMaterial && matchRegion;
  });

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-5xl font-black text-navy uppercase mb-8 italic tracking-tighter">Auction Directory</h1>
        
        {/* 1. ORIGINAL STATUS FILTERS */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['ALL', 'LIVE', 'UPCOMING', 'CLOSED'].map(f => (
            <button 
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                statusFilter === f ? 'bg-orange text-white shadow-lg' : 'bg-white text-navy border border-platinum'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 2. NEW ADDITIONAL FILTERS (BELOW STATUS) */}
        <div className="flex flex-wrap items-center gap-6 mb-10 p-4 bg-white/50 rounded-2xl border border-platinum">
          <div className="flex items-center gap-2 text-navy font-black uppercase text-[10px] tracking-widest">
            <Filter size={14} className="text-orange" /> Refine By:
          </div>

          {/* Material Select */}
          <div className="flex flex-col min-w-[150px]">
            <span className="text-[9px] font-black text-steel uppercase mb-1 ml-1">Material</span>
            <select 
              value={materialFilter} 
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="p-2 bg-white border border-platinum rounded font-bold text-xs text-navy outline-none focus:border-orange cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Region Select */}
          <div className="flex flex-col min-w-[150px]">
            <span className="text-[9px] font-black text-steel uppercase mb-1 ml-1">Region</span>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="p-2 bg-white border border-platinum rounded font-bold text-xs text-navy outline-none focus:border-orange cursor-pointer"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Reset Action */}
          <button 
            onClick={() => { setMaterialFilter('ALL'); setRegionFilter('ALL'); setStatusFilter('ALL'); }}
            className="mt-4 md:mt-0 flex items-center gap-1 text-[10px] font-black text-steel hover:text-orange transition-colors uppercase tracking-widest"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        {/* --- RESULTS --- */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAuctions.map(auc => (
               <AuctionScrollCard 
                 key={auc.id} 
                 auction={auc} 
                 onClick={() => navigate(`/api/v1/e-auction/auctions/listing/${auc.id}`)} 
               />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border-4 border-dashed border-platinum">
            <div className="bg-platinum/30 p-6 rounded-full mb-6">
              <Hammer size={64} className="text-steel/50" />
            </div>
            <h2 className="text-3xl font-black text-navy uppercase mb-2">No Matches Found</h2>
            <p className="text-steel font-medium max-w-md">
              We couldn't find any auctions matching those specific filters. Please try a different combination.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllAuctions;
