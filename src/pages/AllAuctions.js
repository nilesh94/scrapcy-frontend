import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AuctionScrollCard from '../e-auction/components/AuctionScrollCard';
import { Hammer, Filter, XCircle } from 'lucide-react';

const AllAuctions = () => {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- FILTER STATES ---
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // MOCK_AUCTIONS as fallback
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
            category: auc.category, // Used for filtering
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

  const clearFilters = () => {
    setStatusFilter('ALL');
    setMaterialFilter('ALL');
    setRegionFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-navy uppercase mb-2 italic tracking-tighter">Auction Directory</h1>
          <p className="text-steel font-bold">Discover and participate in premium industrial scrap auctions</p>
        </div>
        
        {/* --- ADVANCED FILTER BAR --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum mb-10">
          <div className="flex items-center gap-2 mb-4 text-navy font-black uppercase text-sm tracking-widest">
            <Filter size={18} className="text-orange" /> Filter Results
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-black text-steel uppercase mb-2">Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 bg-platinum/30 border border-platinum rounded font-bold text-navy outline-none focus:border-orange"
              >
                {['ALL', 'LIVE', 'UPCOMING', 'CLOSED'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Material Filter */}
            <div>
              <label className="block text-[10px] font-black text-steel uppercase mb-2">Material</label>
              <select 
                value={materialFilter} 
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="w-full p-3 bg-platinum/30 border border-platinum rounded font-bold text-navy outline-none focus:border-orange"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-[10px] font-black text-steel uppercase mb-2">Region</label>
              <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full p-3 bg-platinum/30 border border-platinum rounded font-bold text-navy outline-none focus:border-orange"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button 
                onClick={clearFilters}
                className="w-full p-3 flex items-center justify-center gap-2 text-steel font-black uppercase text-xs hover:text-orange transition-colors"
              >
                <XCircle size={16} /> Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- RESULTS GRID --- */}
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
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border-4 border-dashed border-platinum">
            <div className="bg-platinum/30 p-6 rounded-full mb-6">
              <Hammer size={64} className="text-steel/50" />
            </div>
            <h2 className="text-3xl font-black text-navy uppercase mb-2">No Matching Auctions</h2>
            <p className="text-steel font-medium max-w-md">
              We couldn't find any auctions matching your current filter criteria. Try resetting your filters.
            </p>
            <button 
              onClick={clearFilters}
              className="mt-8 px-8 py-3 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange transition-colors rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllAuctions;
