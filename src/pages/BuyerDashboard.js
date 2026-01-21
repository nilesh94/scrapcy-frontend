import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, Users, MapPin, TrendingUp,
  Search, Filter, Grid, List, ShieldCheck, ExternalLink, Menu, X, ChevronDown, Package 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace'); 
  const [viewMode, setViewMode] = useState('card');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    material: '',
    form: '',
    grade: '',
    location: '' // Added Location Filter
  });

  // --- 1. AUTH & DATA FETCHING ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      setIsAuthenticated(true);
      fetchListings();
    }
  }, [navigate]);

  const fetchListings = async () => {
    try {
      const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/scrap/all');
      // Normalize API Data (snake_case) to UI Format (camelCase)
      const normalizedData = response.data.map(item => ({
        id: item.id,
        industry: item.scrap_type || "Unknown",
        category: item.category,
        material: item.material_name || "N/A",
        form: item.form || "Standard",
        grade: item.grade || "Standard",
        qty: item.quantity || 0,
        unit: item.unit || "MT", // Fallback if API doesn't send unit
        price: item.price || 0,
        currency: "INR",
        location: item.location || "India",
        sellerName: item.seller_name || "Unknown Trader",
        // Fallback Image
        image: item.image_path 
          ? `https://scrapcy-backend-new-1.onrender.com/${item.image_path}` 
          : "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=300&auto=format&fit=crop",
        postedAt: new Date(item.created_at).toLocaleDateString() // Format Date
      }));
      
      setListings(normalizedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError('Failed to load marketplace data.');
      setLoading(false);
    }
  };

  // --- HELPERS ---
  
  // Get unique values for filters dynamically from the fetched data
  const getUniqueOptions = (key) => {
    return [...new Set(listings.map(item => item[key]).filter(Boolean))].sort();
  };

  // Filter Logic
  const filteredListings = listings.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.material.toLowerCase().includes(term) ||
      item.form.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.industry.toLowerCase().includes(term);

    const matchesIndustry = filters.industry ? item.industry === filters.industry : true;
    const matchesMaterial = filters.material ? item.material === filters.material : true;
    const matchesForm = filters.form ? item.form === filters.form : true;
    const matchesGrade = filters.grade ? item.grade === filters.grade : true;
    const matchesLocation = filters.location ? item.location === filters.location : true;

    return matchesSearch && matchesIndustry && matchesMaterial && matchesForm && matchesGrade && matchesLocation;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Masking Function (Shows first 2 and last 2 chars)
  const maskString = (str) => {
    if (!str || str.length <= 4) return "Tra****";
    return str.substring(0, 2) + "****" + str.substring(str.length - 2);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 relative">
        
        {/* --- 1. NAVIGATION SIDEBAR --- */}
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
              <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'marketplace' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}>
                <LayoutDashboard size={18} /> Marketplace
              </button>
              <button onClick={() => setActiveTab('requirements')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'requirements' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}>
                <Upload size={18} /> Post Requirement
              </button>
              <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'saved' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}>
                <Save size={18} /> Saved Listings
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded transition-colors ${activeTab === 'orders' ? 'bg-orange/10 text-orange' : 'text-steel hover:bg-platinum hover:text-navy'}`}>
                <FileText size={18} /> My Orders
              </button>
           </nav>
        </aside>

        {/* --- 2. MAIN CONTENT AREA --- */}
        <main className="flex-grow">
          
          <div className="md:hidden mb-4">
             <button onClick={() => setShowMobileNav(true)} className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow text-navy font-bold text-sm">
                <Menu size={18} /> Menu
             </button>
          </div>

          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOP BAR */}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-platinum flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
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

                  <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-colors ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-platinum hover:border-orange'}`}
                      >
                        <Filter size={16} /> Filters {showFilters ? <ChevronDown size={14}/> : <ExternalLink size={14} className="rotate-90"/>}
                      </button>

                      <div className="flex bg-platinum/30 rounded p-1 border border-platinum">
                        <button onClick={() => setViewMode('card')} className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'card' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}>
                          <Grid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}>
                          <List size={16} />
                        </button>
                      </div>
                  </div>
              </div>

              {/* FILTERS PANEL */}
              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-inner border border-platinum grid grid-cols-1 md:grid-cols-5 gap-4 animate-slideDown">
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
                    {/* NEW: Location Filter */}
                    <div>
                      <label className="text-[10px] font-black text-steel uppercase mb-1 block">Location</label>
                      <select value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none">
                        <option value="">All Locations</option>
                        {getUniqueOptions('location').map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                </div>
              )}

              {/* LISTINGS DISPLAY */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded shadow-lg">
                  <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-steel font-bold uppercase tracking-widest text-xs">Loading Marketplace...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 p-8 rounded-lg text-center font-bold">
                  {error}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow text-center border border-platinum">
                   <Package size={48} className="text-gray-300 mx-auto mb-4"/>
                   <h3 className="text-lg font-bold text-navy">No Listings Found</h3>
                   <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              ) : viewMode === 'card' ? (
                // CARD VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-platinum group relative">
                      <div className="h-40 bg-gray-200 relative overflow-hidden">
                        <img src={item.image} alt={item.material} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-navy shadow-sm">
                          {item.postedAt}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-lg font-black text-navy uppercase leading-tight line-clamp-1">{item.material}</h4>
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
                                <p className="text-xs font-bold text-navy flex items-center gap-1">
                                  <ShieldCheck size={12} className="text-green-500"/>
                                  {maskString(item.sellerName)}
                                </p>
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
                // LIST VIEW
                <div className="bg-white rounded-lg shadow-lg border border-platinum overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-navy text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Material Details</th>
                                <th className="p-4">Qty</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Seller (Masked)</th>
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
                                    <td className="p-4"><div className="flex items-center gap-1"><MapPin size={12}/>{item.location}</div></td>
                                    <td className="p-4">
                                        <p className="font-bold text-xs flex items-center gap-1">
                                           <ShieldCheck size={12} className="text-green-500"/> {maskString(item.sellerName)}
                                        </p>
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

          {activeTab !== 'marketplace' && (
             <div className="bg-white p-12 rounded-lg shadow-lg border border-platinum text-center animate-fadeIn">
                <div className="inline-block p-4 bg-platinum/50 rounded-full mb-4">
                   <Upload size={40} className="text-steel"/>
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
