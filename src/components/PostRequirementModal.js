import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, Save, FileText, MapPin, 
  Search, Filter, Grid, List, ShieldCheck, ExternalLink, ChevronDown, 
  Package, MessageCircle, ChevronLeft, ChevronRight, PlusCircle, 
  CheckCircle, XCircle, Trash2, Clock 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PostRequirementModal from '../components/PostRequirementModal';

// --- IMAGE CAROUSEL COMPONENT ---
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs font-bold uppercase">No Image</span>
      </div>
    );
  }

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-56 bg-gray-200 relative group overflow-hidden">
      <img 
        src={images[currentIndex]} 
        alt={`${title} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div key={idx} className={`h-1.5 w-1.5 rounded-full shadow-sm ${idx === currentIndex ? 'bg-orange' : 'bg-white/60'}`}/>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Data States
  const [listings, setListings] = useState([]);
  const [myRequirements, setMyRequirements] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [reqLoading, setReqLoading] = useState(false);
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

  // --- 1. AUTH & INITIAL FETCH ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      setIsAuthenticated(true);
      fetchListings();
    }
  }, [navigate]);

  // Fetch Requirements whenever tab changes to 'requirements'
  useEffect(() => {
    if (activeTab === 'requirements' && isAuthenticated) {
        fetchMyRequirements();
    }
  }, [activeTab, isAuthenticated]);

  // --- API CALLS ---

  const fetchListings = async () => {
    try {
      const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/scrap/all');
      
      const normalizedData = response.data.map(item => {
        let cleanLocation = item.address || "India";
        if (cleanLocation.includes(',')) {
            const parts = cleanLocation.split(',');
            cleanLocation = parts[parts.length - 1].trim(); 
        }

        let imageList = [];
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            imageList = item.images.map(imgObj => imgObj.image_url);
        } else if (item.image_path) {
            imageList.push(`https://scrapcy-backend-new-1.onrender.com/${item.image_path}`);
        }
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
            images: imageList,
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

  // --- UPDATED: FETCH FROM REAL API ---
  const fetchMyRequirements = async () => {
    setReqLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/requirements/my', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map API response to UI
        const mappedData = response.data.map(req => ({
            id: req.id,
            material: req.material,
            details: `${req.form || '-'} • ${req.grade || '-'}`,
            location: req.locations,
            status: req.status,
            postedAt: new Date(req.created_at).toLocaleDateString()
        }));

        setMyRequirements(mappedData);
    } catch (err) {
        console.error("Error fetching requirements:", err);
        // If error (e.g. no data), explicitly set empty array to show "No Data" UI
        setMyRequirements([]);
    } finally {
        setReqLoading(false);
    }
  };

  // --- STATUS UPDATES (Real API Calls) ---

  const handleUpdateStatus = async (id, newStatus) => {
    // 1. Optimistic Update (UI updates immediately)
    setMyRequirements(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
    ));

    try {
        const token = localStorage.getItem('token');
        await axios.put(
            `https://scrapcy-backend-new-1.onrender.com/requirements/${id}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) {
        console.error("Status update failed", err);
        alert("Failed to update status on server.");
        fetchMyRequirements(); // Revert on error
    }
  };

  const handleDeleteRequirement = async (id) => {
    if(!window.confirm("Are you sure you want to delete this requirement permanently?")) return;

    // 1. Optimistic Delete
    setMyRequirements(prev => prev.filter(req => req.id !== id));

    try {
        // "Soft Delete" by setting status to DELETED
        const token = localStorage.getItem('token');
        await axios.put(
            `https://scrapcy-backend-new-1.onrender.com/requirements/${id}/status`, 
            { status: 'DELETED' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete requirement.");
        fetchMyRequirements(); // Revert on error
    }
  };

  const handlePostSuccess = () => {
      setIsPostModalOpen(false);
      fetchMyRequirements(); // Refresh list to show new item
  };

  // --- FILTERS ---
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

  const handleViewDetails = (id) => console.log("View Details for:", id);
  const handleRFQ = (id) => alert("RFQ Sent to Seller!");

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      {/* --- HORIZONTAL NAVIGATION --- */}
      <div className="bg-white border-b border-platinum shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('marketplace')} className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-all whitespace-nowrap ${activeTab === 'marketplace' ? 'border-orange text-navy' : 'border-transparent text-steel hover:text-navy'}`}>
              <LayoutDashboard size={18} /> Marketplace
            </button>
            <button onClick={() => setActiveTab('requirements')} className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-all whitespace-nowrap ${activeTab === 'requirements' ? 'border-orange text-navy' : 'border-transparent text-steel hover:text-navy'}`}>
              <Upload size={18} /> Post Requirement
            </button>
            <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-all whitespace-nowrap ${activeTab === 'saved' ? 'border-orange text-navy' : 'border-transparent text-steel hover:text-navy'}`}>
              <Save size={18} /> Saved
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-wider border-b-4 transition-all whitespace-nowrap ${activeTab === 'orders' ? 'border-orange text-navy' : 'border-transparent text-steel hover:text-navy'}`}>
              <FileText size={18} /> My Orders
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl w-full mx-auto p-4 relative">
        <main>
          {/* ================= MARKETPLACE TAB ================= */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* SEARCH & FILTERS */}
              <div className="bg-white p-4 rounded-lg shadow-lg border border-platinum flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                  <div className="relative w-full xl:w-96">
                    <Search className="absolute left-3 top-2.5 text-steel" size={18} />
                    <input type="text" placeholder="Search scrap, grade, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
                      <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-colors ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-platinum hover:border-orange'}`}>
                        <Filter size={16} /> Filters {showFilters ? <ChevronDown size={14}/> : <ExternalLink size={14} className="rotate-90"/>}
                      </button>
                      <div className="flex bg-platinum/30 rounded p-1 border border-platinum">
                        <button onClick={() => setViewMode('card')} className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'card' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}><Grid size={16} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded flex items-center gap-2 text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}><List size={16} /></button>
                      </div>
                  </div>
              </div>

              {/* FILTERS PANEL */}
              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-inner border border-platinum grid grid-cols-1 md:grid-cols-5 gap-4 animate-slideDown">
                    {['industry', 'material', 'form', 'grade', 'location'].map((filterKey) => (
                      <div key={filterKey}>
                        <label className="text-[10px] font-black text-steel uppercase mb-1 block">{filterKey}</label>
                        <select value={filters[filterKey]} onChange={(e) => handleFilterChange(filterKey, e.target.value)} className="w-full p-2 bg-platinum/20 border border-platinum rounded text-xs text-navy font-bold focus:border-orange outline-none capitalize">
                          <option value="">All</option>
                          {getUniqueOptions(filterKey).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                </div>
              )}

              {/* LISTINGS DISPLAY */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded shadow-lg">
                  <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-steel font-bold uppercase tracking-widest text-xs">Loading Marketplace...</p>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 p-8 rounded-lg text-center font-bold">{error}</div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow text-center border border-platinum">
                    <Package size={48} className="text-gray-300 mx-auto mb-4"/>
                    <h3 className="text-lg font-bold text-navy">No Listings Found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              ) : viewMode === 'card' ? (
                // CARD VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredListings.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-platinum group relative flex flex-col">
                      <ImageCarousel images={item.images} title={item.material} />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-navy shadow-sm pointer-events-none">{item.postedAt}</div>
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-lg font-black text-navy uppercase leading-tight line-clamp-1" title={item.material}>{item.material}</h4>
                            <span className="text-xs font-bold text-orange uppercase tracking-wide block mt-1">{item.form} • {item.grade}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-platinum">
                             <div><p className="text-[10px] text-steel font-bold uppercase">Price</p><p className="text-xl font-black text-navy">₹{item.price.toLocaleString()}</p></div>
                             <div className="text-right"><p className="text-[10px] text-steel font-bold uppercase">Quantity</p><p className="text-sm font-bold text-navy">{item.qty} {item.unit}</p></div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                             <div className="flex items-center gap-2"><MapPin size={16} className="text-orange" /><span className="font-medium truncate">{item.location}</span></div>
                             <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-600" /><span className="font-bold text-xs uppercase">{maskString(item.sellerName)}</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                             <button onClick={() => handleViewDetails(item.id)} className="px-3 py-2 border-2 border-navy text-navy rounded text-xs font-bold uppercase hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-1"><ExternalLink size={14} /> Details</button>
                             <button onClick={() => handleRFQ(item.id)} className="px-3 py-2 bg-orange text-white rounded text-xs font-bold uppercase hover:bg-navy transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg"><MessageCircle size={14} /> RFQ</button>
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
                            <tr><th className="p-4">Material</th><th className="p-4">Details</th><th className="p-4">Qty & Price</th><th className="p-4">Location</th><th className="p-4 text-right">Actions</th></tr>
                         </thead>
                         <tbody className="divide-y divide-platinum text-sm text-navy">
                            {filteredListings.map(item => (
                                <tr key={item.id} className="hover:bg-platinum/20 transition-colors">
                                    <td className="p-4 w-16"><div className="h-12 w-12 bg-gray-200 rounded overflow-hidden border border-platinum"><img src={item.images[0]} alt="" className="h-full w-full object-cover"/></div></td>
                                    <td className="p-4"><p className="font-bold text-navy">{item.material}</p><p className="text-xs text-orange font-semibold">{item.form} - {item.grade}</p><p className="text-[10px] text-steel mt-1 flex items-center gap-1"><ShieldCheck size={10} className="text-green-500"/> {maskString(item.sellerName)}</p></td>
                                    <td className="p-4"><p className="font-bold">{item.qty} {item.unit}</p><p className="text-xs text-steel">₹{item.price.toLocaleString()} / {item.unit}</p></td>
                                    <td className="p-4"><div className="flex items-center gap-1 text-xs font-medium"><MapPin size={12} className="text-steel"/> {item.location}</div></td>
                                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(item.id)} className="text-navy font-bold text-xs hover:underline">View</button><button onClick={() => handleRFQ(item.id)} className="bg-orange text-white px-3 py-1 rounded text-xs font-bold hover:bg-navy">RFQ</button></div></td>
                                </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                </div>
              )}
            </div>
          )}

          {/* ================= REQUIREMENTS TAB (OPEN RFQ) ================= */}
          {activeTab === 'requirements' && (
             <div className="space-y-6 animate-fadeIn">
                {/* Header Action */}
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow border border-platinum">
                    <div>
                        <h2 className="text-xl font-black text-navy uppercase tracking-tighter">My Open Requirements</h2>
                        <p className="text-steel text-xs font-medium">Manage your active RFQs visible to sellers.</p>
                    </div>
                    <button 
                        onClick={() => setIsPostModalOpen(true)}
                        className="bg-navy text-white px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-widest shadow hover:bg-orange transition-all flex items-center gap-2"
                    >
                        <PlusCircle size={18} /> Post New
                    </button>
                </div>

                {/* RFQ List */}
                {reqLoading ? (
                    <div className="text-center py-20 bg-white rounded shadow">Loading Requirements...</div>
                ) : myRequirements.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg shadow-lg border border-platinum text-center">
                        <div className="inline-block p-6 bg-orange/10 rounded-full mb-6 text-orange animate-bounce">
                           <Upload size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-navy uppercase mb-2">No Requirements Posted</h3>
                        <p className="text-steel mb-8 max-w-lg mx-auto">
                           Post an Open RFQ to the marketplace. Sellers will be notified and can contact you.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {myRequirements.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md border border-platinum transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-black text-navy">{req.material}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide
                                            ${req.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                                              req.status === 'FULFILLED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`
                                        }>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-steel">
                                        <span className="flex items-center gap-1"><Package size={14}/> {req.details}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14}/> {req.location}</span>
                                        <span className="flex items-center gap-1"><Clock size={14}/> {req.postedAt}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {/* Action Buttons based on Status */}
                                    {req.status === 'OPEN' && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateStatus(req.id, 'FULFILLED')}
                                                className="flex-1 md:flex-none px-4 py-2 border border-green-500 text-green-600 rounded text-xs font-bold uppercase hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                                                title="Mark as Fulfilled"
                                            >
                                                <CheckCircle size={16} /> Fulfill
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(req.id, 'CLOSED')}
                                                className="flex-1 md:flex-none px-4 py-2 border border-gray-400 text-gray-500 rounded text-xs font-bold uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                                title="Close Requirement"
                                            >
                                                <XCircle size={16} /> Close
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* Delete is always available */}
                                    <button 
                                        onClick={() => handleDeleteRequirement(req.id)}
                                        className="px-4 py-2 bg-red-50 text-red-500 rounded text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
          )}

          {/* Placeholders for Saved/Orders */}
          {['saved', 'orders'].includes(activeTab) && (
             <div className="bg-white p-12 rounded-lg shadow-lg border border-platinum text-center animate-fadeIn">
                <div className="inline-block p-4 bg-platinum/50 rounded-full mb-4">
                   {activeTab === 'saved' ? <Save size={40} className="text-steel"/> : <FileText size={40} className="text-steel"/>}
                </div>
                <h3 className="text-xl font-black text-navy uppercase">{activeTab} Module</h3>
                <p className="text-steel mt-2">Coming soon.</p>
             </div>
          )}
        </main>
      </div>

      {/* --- POST REQUIREMENT MODAL --- */}
      <PostRequirementModal 
        isOpen={isPostModalOpen} 
        onClose={handlePostSuccess} 
        isAuthenticated={isAuthenticated}
      />

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
