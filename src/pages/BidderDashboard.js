import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Search, TrendingUp, Clock, Gavel, LogOut, Filter } from 'lucide-react';

const BidderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: 'Bidder' });

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-platinum pb-20">
      
      {/* HEADER */}
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Bidder Portal</h1>
            <p className="text-steel text-sm font-bold uppercase tracking-widest">
                Welcome, {user.first_name} • Live Markets
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-4">
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-bold uppercase text-red-400 hover:text-white transition"
            >
                <LogOut size={14} /> Logout Session
            </button>
            <div className="relative">
                <Search className="absolute left-3 top-3 text-steel" size={16} />
                <input 
                    type="text" 
                    placeholder="Search Materials..." 
                    className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-steel text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange w-64"
                />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        
        {/* FILTERS & STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 shadow-lg border-l-4 border-orange">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-orange" size={20} />
                    <h3 className="font-black text-navy text-lg">Live Auctions</h3>
                </div>
                <p className="text-3xl font-black text-navy">24</p>
                <p className="text-xs text-steel uppercase font-bold mt-1">Happening Now</p>
            </div>
            
            <div className="bg-white p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2">
                    <Gavel className="text-green-600" size={20} />
                    <h3 className="font-black text-navy text-lg">My Active Bids</h3>
                </div>
                <p className="text-3xl font-black text-navy">3</p>
                <p className="text-xs text-steel uppercase font-bold mt-1">Currently Winning</p>
            </div>

            {/* Placeholder for future widgets */}
            <div className="md:col-span-2 bg-navy text-white p-6 shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="font-black text-xl uppercase tracking-tighter">Verified Sellers Only</h3>
                    <p className="text-steel text-xs mt-1">All auctions are verified by Scrapcy.</p>
                </div>
                <button className="bg-orange text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-navy transition">
                    View Verified List
                </button>
            </div>
        </div>

        {/* AUCTION LISTINGS */}
        <div className="bg-white p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-platinum pb-4">
                <h2 className="text-2xl font-black uppercase text-navy flex items-center gap-3">
                    <LayoutGrid className="text-orange"/> Available Lots
                </h2>
                <button className="flex items-center gap-2 text-xs font-bold uppercase text-steel hover:text-navy">
                    <Filter size={14} /> Filter Results
                </button>
            </div>

            {/* Example Auction Card */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="group border border-platinum hover:border-orange transition-all duration-300 bg-white hover:shadow-xl">
                        {/* Image Placeholder */}
                        <div className="h-48 bg-platinum/50 w-full flex items-center justify-center text-steel group-hover:bg-platinum/30 transition">
                            <span className="font-black uppercase text-xs tracking-widest">Image Preview</span>
                        </div>
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-navy text-lg uppercase leading-tight">Copper Wire Scrap</h3>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Live</span>
                            </div>
                            <p className="text-steel text-xs font-bold mb-4">Hyderabad, TS • 50 Tons</p>
                            
                            <div className="flex justify-between items-end border-t border-platinum pt-4 mt-4">
                                <div>
                                    <p className="text-[10px] font-bold text-steel uppercase">Current Bid</p>
                                    <p className="text-xl font-black text-navy">₹ 45,000<span className="text-xs text-steel font-medium">/ton</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-orange uppercase flex items-center gap-1 justify-end">
                                        <Clock size={10} /> Ends in 2h
                                    </p>
                                    <button className="mt-1 bg-navy text-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-orange transition">
                                        Bid Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default BidderDashboard;
