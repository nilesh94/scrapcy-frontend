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

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        // Fetching directly from your Oracle-backed API
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/api/v1/e-auction/auctions/listing');
        
        if (response.data.auctions) {
          const formatted = response.data.auctions.map(auc => ({
            id: auc.id,
            title: auc.auction_title,
            // UI Status mapping: SCHEDULED (DB) -> UPCOMING (UI)
            status: auc.status === 'SCHEDULED' ? 'UPCOMING' : auc.status,
            date: new Date(auc.scheduled_start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(auc.scheduled_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: auc.region,
            category: auc.category,
            quantity: auc.quantity || "TBD",
            items: auc.items || []
          }));
          setAuctions(formatted);
        }
      } catch (error) {
        console.error("Error fetching live auction data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // --- DYNAMIC FILTER OPTIONS ---
  // These options are generated in real-time based on the data currently in your DB
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
        {isLoading ? (
          <div className="flex justify-center py-24">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange"></div>
          </div>
        ) : filteredAuctions.length > 0 ? (
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
              The database returned no auctions matching your criteria. Please check back later or update your filters.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllAuctions;
