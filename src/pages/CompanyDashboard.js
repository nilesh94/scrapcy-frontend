import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Package, Gavel, Upload, X } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({ first_name: 'Company' });

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          setUser(JSON.parse(storedUser));
      }
  }, []);

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* PAGE HEADER */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Company Console</h1>
              <p className="text-steel text-sm font-bold uppercase tracking-widest">
                  Welcome, {user.first_name} • Manage Inventory
              </p>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-widest transition rounded-t-lg ${activeTab === 'overview' ? 'bg-orange text-white shadow-lg transform -translate-y-1' : 'bg-white/5 hover:bg-white/10 text-steel'}`}
                >
                  <LayoutDashboard size={16} /> Overview
                </button>
                <button 
                  onClick={() => setActiveTab('post')}
                  className={`flex items-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-widest transition rounded-t-lg ${activeTab === 'post' ? 'bg-orange text-white shadow-lg transform -translate-y-1' : 'bg-white/5 hover:bg-white/10 text-steel'}`}
                >
                  <PlusCircle size={16} /> Post Auction
                </button>
            </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
            {/* Stat Cards */}
            <div className="bg-white p-6 shadow-xl border-l-4 border-orange rounded-r-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-platinum/30 rounded"><Package className="text-navy" size={24}/></div>
                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">Active</span>
              </div>
              <h3 className="text-3xl font-black text-navy">12 Tons</h3>
              <p className="text-steel text-xs font-bold uppercase mt-1">Copper Wire (Grade A)</p>
            </div>
            
            <div className="bg-white p-6 shadow-xl border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-platinum/30 rounded"><Gavel className="text-navy" size={24}/></div>
                <span className="text-orange font-bold text-xs bg-orange/10 px-2 py-1 rounded">Bidding Live</span>
              </div>
              <h3 className="text-3xl font-black text-navy">$4,250</h3>
              <p className="text-steel text-xs font-bold uppercase mt-1">Highest Bid (HMS Steel)</p>
            </div>
          </div>
        )}

        {/* VIEW 2: POST AUCTION FORM */}
        {activeTab === 'post' && (
          <div className="bg-white p-8 shadow-2xl rounded-lg animate-fadeIn border-t-4 border-orange">
            <div className="flex justify-between items-center mb-8 border-b border-platinum pb-6">
              <h2 className="text-2xl font-black uppercase text-navy flex items-center gap-3">
                <PlusCircle className="text-orange"/> New Auction Listing
              </h2>
              <button onClick={() => setActiveTab('overview')}><X className="text-steel hover:text-red-500 transition"/></button>
            </div>

            <form className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-steel mb-1">Lot Title</label>
                  <input type="text" placeholder="e.g. 50 Tons of HMS 1&2 Scrap" className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-steel mb-1">Material Type</label>
                    <select className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm">
                      <option>Select...</option>
                      <option>Copper</option>
                      <option>Aluminum</option>
                      <option>Steel</option>
                      <option>Brass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-steel mb-1">Quantity (Tons)</label>
                    <input type="number" placeholder="0" className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-steel mb-1">Starting Bid Price (₹/Ton)</label>
                  <input type="number" placeholder="₹ 0.00" className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-steel mb-1">Auction Duration</label>
                  <select className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm">
                    <option>24 Hours</option>
                    <option>3 Days</option>
                    <option>7 Days</option>
                  </select>
                </div>
              </div>

              {/* Right Column: Uploads & Confirm */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-steel mb-1">Upload Material Photos</label>
                  <div className="border-2 border-dashed border-steel/30 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-platinum/20 transition cursor-pointer group">
                    <Upload className="text-steel mb-4 group-hover:text-orange transition" size={32} />
                    <p className="text-sm font-bold text-navy">Drag & Drop or Click to Upload</p>
                    <p className="text-xs text-steel mt-2">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-steel mb-1">Description / Location Info</label>
                  <textarea rows="4" className="w-full p-4 bg-platinum/20 border border-platinum outline-orange font-bold text-navy text-sm" placeholder="Enter pickup location and specific quality details..."></textarea>
                </div>

                <button className="w-full bg-orange text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-navy transition-all shadow-lg mt-4">
                  Publish Live Auction
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;
