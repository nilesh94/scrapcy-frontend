import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, Users, MapPin, TrendingUp,
  Search, Filter, Grid, List, ShieldCheck, ExternalLink, Menu, X, ChevronDown 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

// --- MOCK DATA ---
const MOCK_LISTINGS = [
  {
    id: 1,
    industry: "Ferrous Metal",
    material: "MS Scrap",
    form: "HMS",
    grade: "80:20",
    qty: 500,
    unit: "MT",
    price: 32000,
    currency: "INR",
    location: "Mandi Gobindgarh, Punjab",
    sellerName: "Varun Traders",
    sellerRating: 4.5,
    isVerified: true,
    postedAt: "2 hrs ago",
    image: "https://images.unsplash.com/photo-1535287680073-677a284da09c?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: 2,
    industry: "Non-Ferrous",
    material: "Copper",
    form: "Wire",
    grade: "Millberry",
    qty: 1200,
    unit: "Kg",
    price: 720,
    currency: "INR",
    location: "Alang, Gujarat",
    sellerName: "Oceanic Salvage",
    sellerRating: 4.8,
    isVerified: true,
    postedAt: "5 hrs ago",
    image: "https://images.unsplash.com/photo-1605557202138-095595ae07cc?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: 3,
    industry: "Plastic",
    material: "HDPE",
    form: "Drum",
    grade: "Standard",
    qty: 5,
    unit: "MT",
    price: 95,
    currency: "INR",
    location: "Mumbai, Maharashtra",
    sellerName: "Polymex Industries",
    sellerRating: 4.2,
    isVerified: false,
    postedAt: "1 day ago",
    image: "https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: 4,
    industry: "Ferrous Metal",
    material: "Stainless Steel",
    form: "Solid",
    grade: "304",
    qty: 15,
    unit: "MT",
    price: 125000,
    currency: "INR",
    location: "Chennai, Tamil Nadu",
    sellerName: "Southern Steels",
    sellerRating: 4.0,
    isVerified: true,
    postedAt: "2 days ago",
    image: "https://images.unsplash.com/photo-1518709325690-34d31405df61?auto=format&fit=crop&q=80&w=300"
  }
];

const BuyerDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'requirements', 'saved'
  const [viewMode, setViewMode] = useState('card');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    material: '',
    form: '',
    grade: ''
  });

  // --- AUTH CHECK ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // --- HELPERS ---
  const getUniqueOptions = (key) => {
    return [...new Set(MOCK_LISTINGS.map(item => item[key]))].sort();
  };

  const filteredListings = MOCK_LISTINGS.filter(item => {
    const matchesSearch = 
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.form.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = filters.industry ? item.industry === filters.industry : true;
    const matchesMaterial = filters.material ? item.material === filters.material : true;
    const matchesForm = filters.form ? item.form === filters.form : true;
    const matchesGrade = filters.grade ? item.grade === filters.grade : true;

    return matchesSearch && matchesIndustry && matchesMaterial && matchesForm && matchesGrade;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const maskString = (str) => {
    if (!str) return "******";
    return str.substring(0, 2) + "****" + str.substring(str.length - 2);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 relative">
        
        {/* --- 1. NAVIGATION SIDEBAR (Left) --- */}
        <aside className={`
            md:w-64 flex-shrink-0 bg-white rounded-lg shadow-lg border-t-4 border-orange overflow-hidden h-fit
            ${showMobileNav ? 'fixed inset-0 z-50 m-4' : 'hidden md:block'}
        `}>
           <div className="p-5 bg-navy text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                 Buyer Menu
              </h3>
              <button onClick={() => setShowMobileNav(false)} className="md:hidden text-white">
                <X size={20} />
              </button>
           </div>
           
           <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab('marketplace')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'marketplace' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}
              >
                <LayoutDashboard size={18} /> Marketplace
              </button>

              <button 
                onClick={() => setActiveTab('requirements')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'requirements' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}
              >
                <Upload size={18} /> Post Requirement
              </button>

              <button 
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'saved' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}
              >
                <Save size={18} /> Saved Listings
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'orders' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}
              >
                <FileText size={18} /> My Orders
              </button>

              <div className="h-px bg-platinum my-2"></div>

              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-steel hover:bg-platinum hover:text-navy rounded">
                <TrendingUp size={18} /> Market Trends
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-steel hover:bg-platinum hover:text-navy rounded">
                <Users size={18} /> Profile Settings
              </button>
           </nav>
        </aside>

        {/* --- 2. MAIN CONTENT AREA --- */}
        <main className="flex-grow">
          
          {/* Mobile Nav Toggle */}
          <div className="md:hidden mb-4">
             <button onClick={() => setShowMobileNav(true)} className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow text-navy font-bold text-sm">
                <Menu size={18} /> Menu
             </button>
          </div>

          {/* DYNAMIC CONTENT SWITCHER */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP BAR: Search & Filters */}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-platinum flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                  
                  {/* Search */}
                  <div className="relative w-full xl:w-96">
                    <Search className="absolute left-3 top-2.5 text-steel" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search scrap, grade, or location..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 p-2 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none"
                    />
                  </div>

                  {/* Filter Toggles & View Mode */}
                  <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                      
                      {/* Filter Button (Collapsible) */}
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-colors ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-platinum hover:border-orange'}`}
                      >
                        <Filter size={16} /> Filters {showFilters ? <ChevronDown size={14}/> : <ExternalLink size={14} className="rotate-90"/>}
                      </button>

                      {/* View Mode */}
                      <div className="flex bg-platinum/30 rounded p-1 border border-platinum">
                        <button 
                          onClick={() => setViewMode('card')}
                          className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'card' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}
                        >
                          <Grid size={16} />
                        </button>
                        <button 
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}
                        >
                          <List size={16} />
                        </button>
                      </div>
                  </div>
              </div>

              {/* COLLAPSIBLE FILTER PANEL */}
              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-inner border border-platinum grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideDown">
                    <div>
                      <label className="text-[10px] font-black text-steel uppercase mb-1 block">Industry</label>
                      <select value={filters.industry} onChange={(e) => handleFilterChange('industry', e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none">
                        <option value="">All</option>
                        {getUniqueOptions('industry').map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-steel uppercase mb-1 block">Material</label>
                      <select value={filters.material} onChange={(e) => handleFilterChange('material', e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none">
                        <option value="">All</option>
                        {getUniqueOptions('material').map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-steel uppercase mb-1 block">Form</label>
                      <select value={filters.form} onChange={(e) => handleFilterChange('form', e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none">
                        <option value="">All</option>
                        {getUniqueOptions('form').map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-steel uppercase mb-1 block">Grade</label>
                      <select value={filters.grade} onChange={(e) => handleFilterChange('grade', e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none">
                        <option value="">All</option>
                        {getUniqueOptions('grade').map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                </div>
              )}

              {/* LISTINGS GRID/LIST */}
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-platinum group relative">
                      {/* Image */}
                      <div className="h-40 bg-gray-200 relative overflow-hidden">
                        <img src={item.image} alt={item.material} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-navy shadow-sm">
                          {item.postedAt}
                        </div>
                        {item.isVerified && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <ShieldCheck size={12} /> Verified
                          </div>
                        )}
                      </div>
                      
                      {/* Body */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-lg font-black text-navy uppercase leading-tight">{item.material}</h4>
                                <span className="text-xs font-bold text-orange uppercase tracking-wide">{item.form} - {item.grade}</span>
                            </div>
                            <div className="text-right">
                                 <span className="block text-xl font-black text-navy">₹{item.price.toLocaleString()}</span>
                                 <span className="text-[10px] text-steel font-bold uppercase">Per {item.unit}</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                             <div className="flex items-center gap-2">
                                  <div className="w-6 flex justify-center"><CheckCircle size={14} className="text-steel" /></div>
                                  <span className="font-medium">Qty:</span> {item.qty} {item.unit}
                             </div>
                             <div className="flex items-center gap-2">
                                  <div className="w-6 flex justify-center"><MapPin size={14} className="text-steel" /></div>
                                  <span className="truncate">{item.location}</span>
                             </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-platinum flex items-center justify-between">
                             <div>
                                <p className="text-xs font-bold text-navy">{maskString(item.sellerName)}</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(Math.floor(item.sellerRating))].map((_,i) => <span key={i} className="text-orange text-xs">★</span>)}
                                </div>
                             </div>
                             <button className="bg-navy text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-orange transition-colors">
                               Contact
                             </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg border border-platinum overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-navy text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Material Details</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Seller</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-platinum text-sm text-navy">
                            {filteredListings.map(item => (
                                <tr key={item.id} className="hover:bg-platinum/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                                                <img src={item.image} alt="" className="h-full w-full object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.material}</p>
                                                <p className="text-xs text-orange font-semibold">{item.form} ({item.grade})</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{item.qty} {item.unit}</td>
                                    <td className="p-4 font-bold">₹{item.price.toLocaleString()}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-xs">{maskString(item.sellerName)}</p>
                                        <p className="text-[10px] text-steel">{item.location}</p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-navy hover:text-orange font-bold text-xs uppercase underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* PLACEHOLDER FOR OTHER TABS */}
          {activeTab !== 'marketplace' && (
             <div className="bg-white p-12 rounded-lg shadow-lg border border-platinum text-center animate-fadeIn">
                <div className="inline-block p-4 bg-platinum/50 rounded-full mb-4">
                   {activeTab === 'requirements' && <Upload size={40} className="text-steel"/>}
                   {activeTab === 'saved' && <Save size={40} className="text-steel"/>}
                   {activeTab === 'orders' && <FileText size={40} className="text-steel"/>}
                </div>
                <h3 className="text-xl font-black text-navy uppercase">Coming Soon</h3>
                <p className="text-steel mt-2 max-w-md mx-auto">
                   The <strong>{activeTab.replace('_', ' ')}</strong> module is currently under development. Stay tuned!
                </p>
             </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
