import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, Save, FileText, MapPin, 
  Search, Filter, Grid, List, ShieldCheck, ExternalLink, Menu, X, ChevronDown, Package, MessageCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

// --- NEW COMPONENT: IMAGE CAROUSEL ---
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, show fallback
  if (!images || images.length === 0) {
    return (
      <div className="h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs font-bold uppercase">No Image</span>
      </div>
    );
  }

  const prevSlide = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-56 bg-gray-200 relative group overflow-hidden">
      {/* Main Image */}
      <img 
        src={images[currentIndex]} 
        alt={`${title} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-transform duration-500" 
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Navigation Arrows (Only if > 1 image) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 w-1.5 rounded-full shadow-sm ${idx === currentIndex ? 'bg-orange' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


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
    location: ''
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
      
      const normalizedData = response.data.map(item => {
        // 1. Resolve Location
        let cleanLocation = item.address || "India";
        if (cleanLocation.includes(',')) {
            const parts = cleanLocation.split(',');
            cleanLocation = parts[parts.length - 1].trim(); 
        }

        // 2. Resolve ALL Images
        let imageList = [];
        
        // Priority A: Check the 'images' array from JSON response
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            imageList = item.images.map(imgObj => imgObj.image_url);
        } 
        // Priority B: Check legacy 'image_path'
        else if (item.image_path) {
            imageList.push(`https://scrapcy-backend-new-1.onrender.com/${item.image_path}`);
        }
        
        // Priority C: Fallback if absolutely no images found
        if (imageList.length === 0) {
            imageList.push("https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=300&auto=format&fit=crop");
        }

        return {
            id: item.id,
            industry: item.category_ref?.material_category || item.scrap_type || "General",
            category: item.category_ref?.scrap_type || "Scrap",
            material: item.material_ref?.material_name || "Material Not Specified",
            form: item.form_ref?.form_name || item.form || "Standard",
            grade: item.grade_ref?.grade_name || item.grade || "Standard",
            qty: item.quantity || 0,
            unit: item.unit || "Tons", 
            price: item.price_per_unit || 0,
            currency: "INR",
            location: cleanLocation,
            sellerName: item.company_name || item.seller_name || "Verified Seller",
            images: imageList, // Storing Array of URLs
            postedAt: new Date(item.created_at).toLocaleDateString()
        };
      });
      
      setListings(normalizedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError('Failed to load marketplace data.');
      setLoading(false);
    }
  };

  // --- HELPERS ---
  const getUniqueOptions = (key) => {
    return [...new Set(listings.map(item => item[key]).filter(Boolean))].sort();
  };

  const filteredListings = listings.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (item.material || "").toLowerCase().includes(term) ||
      (item.form || "").toLowerCase().includes(term) ||
      (item.location || "").toLowerCase().includes(term) ||
      (item.industry || "").toLowerCase().includes(term);

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

  const maskString = (str) => {
    if (!str || str.length <= 4) return "Seller";
    return str.substring(0, 2) + "****" + str.substring(str.length - 2);
  };

  // --- HANDLERS ---
  const handleViewDetails = (id) => {
      console.log("View Details for:", id);
  };

  const handleRFQ = (id) => {
      console.log("RFQ Request for:", id);
      alert("RFQ Sent to Seller! They will contact you shortly.");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 relative">
        
        {/* --- NAVIGATION SIDEBAR --- */}
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

        {/* --- MAIN CONTENT AREA --- */}
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
                // --- CARD VIEW WITH CAROUSEL ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-platinum group relative flex flex-col">
                      
                      {/* 1. IMAGE CAROUSEL COMPONENT */}
                      <ImageCarousel images={item.images} title={item.material} />

                      {/* Absolute Badge for Posted Date */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-navy shadow-sm pointer-events-none">
                        {item.postedAt}
                      </div>

                      {/* 2. CONTENT AREA */}
                      <div className="p-5 flex-grow">
                        
                        {/* Title & Specs */}
                        <div className="mb-4">
                            <h4 className="text-lg font-black text-navy uppercase leading-tight">{item.material}</h4>
                            <span className="text-xs font-bold text-orange uppercase tracking-wide block mt-1">{item.form} • {item.grade}</span>
                        </div>

                        {/* Price & Qty Row */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-platinum">
                             <div>
                                <p className="text-[10px] text-steel font-bold uppercase">Price</p>
                                <p className="text-xl font-black text-navy">₹{item.price.toLocaleString()}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] text-steel font-bold uppercase">Quantity</p>
                                <p className="text-sm font-bold text-navy">{item.qty} {item.unit}</p>
                             </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                             <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-orange" />
                                  <span className="font-medium">{item.location}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                  <ShieldCheck size={16} className="text-green-600" />
                                  <span className="font-bold text-xs uppercase">{maskString(item.sellerName)}</span>
                             </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                             <button 
                                onClick={() => handleViewDetails(item.id)}
                                className="px-3 py-2 border-2 border-navy text-navy rounded text-xs font-bold uppercase hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-1"
                             >
                               <ExternalLink size={14} /> Details
                             </button>
                             <button 
                                onClick={() => handleRFQ(item.id)}
                                className="px-3 py-2 bg-orange text-white rounded text-xs font-bold uppercase hover:bg-navy transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                             >
                               <MessageCircle size={14} /> RFQ
                             </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // --- LIST VIEW ---
                <div className="bg-white rounded-lg shadow-lg border border-platinum overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead className="bg-navy text-white text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Material</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">Qty & Price</th>
                                <th className="p-4">Location</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-platinum text-sm text-navy">
                            {filteredListings.map(item => (
                                <tr key={item.id} className="hover:bg-platinum/20 transition-colors">
                                    <td className="p-4 w-16">
                                        <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden border border-platinum">
                                            <img src={item.images[0]} alt="" className="h-full w-full object-cover"/>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-navy">{item.material}</p>
                                        <p className="text-xs text-orange font-semibold">{item.form} - {item.grade}</p>
                                        <p className="text-[10px] text-steel mt-1 flex items-center gap-1">
                                           <ShieldCheck size={10} className="text-green-500"/> {maskString(item.sellerName)}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold">{item.qty} {item.unit}</p>
                                        <p className="text-xs text-steel">₹{item.price.toLocaleString()} / {item.unit}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-xs font-medium">
                                            <MapPin size={12} className="text-steel"/> {item.location}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleViewDetails(item.id)} className="text-navy font-bold text-xs hover:underline">View</button>
                                            <button onClick={() => handleRFQ(item.id)} className="bg-orange text-white px-3 py-1 rounded text-xs font-bold hover:bg-navy">RFQ</button>
                                        </div>
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
