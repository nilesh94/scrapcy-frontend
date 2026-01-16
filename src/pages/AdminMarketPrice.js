import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { 
  TrendingUp, Save, CheckCircle, XCircle, MapPin, LayoutDashboard, ArrowLeft, Lock 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminMarketPrice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // --- 1. DATA STATE ---
  const [hierarchy, setHierarchy] = useState([]); // Cat/Mat/Grade Tree
  const [locations, setLocations] = useState([]); // List of Locations
  
  // Selection States
  const [selectedScrapType, setSelectedScrapType] = useState(''); 
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  
  const [filteredMaterials, setFilteredMaterials] = useState([]); 
  const [selectedMaterialId, setSelectedMaterialId] = useState(''); 
  
  const [filteredGrades, setFilteredGrades] = useState([]); 
  const [selectedGradeId, setSelectedGradeId] = useState(''); 
  
  const [selectedLocationId, setSelectedLocationId] = useState('');

  // Form State
  const [pricePerMT, setPricePerMT] = useState('');

  // --- 2. SECURITY CHECK & DATA FETCH ---
  useEffect(() => {
    // 1. Security Check (Basic Admin Check)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert("Unauthorized Access. Admins only.");
        navigate('/login'); 
        return;
    }

    const fetchInitialData = async () => {
      try {
        // Fetch Categories
        const catRes = await axios.get('https://scrapcy-backend-new-1.onrender.com/categories/hierarchy');
        setHierarchy(catRes.data);

        // Fetch Locations (Real Backend Call)
        const locRes = await axios.get('https://scrapcy-backend-new-1.onrender.com/locations'); 
        setLocations(locRes.data);
      } catch (err) {
        console.error("Data fetch error", err);
        if(err.code === "ERR_BAD_REQUEST" || err.response?.status === 404) {
            setErrorMsg("API Error: Could not load locations or categories.");
        }
      }
    };

    fetchInitialData();
  }, [navigate]);

  // --- 3. DROPDOWN LOGIC (Cascading) ---
  const handleScrapTypeChange = (e) => {
    const type = e.target.value;
    setSelectedScrapType(type);
    setSelectedCategoryId(''); setFilteredMaterials([]);
    setSelectedMaterialId(''); setFilteredGrades([]);
    setSelectedGradeId('');
    const categories = hierarchy.filter(item => item.scrap_type === type);
    setFilteredCategories(categories);
  };

  const handleCategoryChange = (e) => {
    const catId = parseInt(e.target.value);
    setSelectedCategoryId(catId);
    setSelectedMaterialId(''); setFilteredGrades([]);
    setSelectedGradeId('');
    const catObj = hierarchy.find(item => item.id === catId);
    setFilteredMaterials(catObj ? catObj.materials : []);
  };

  const handleMaterialChange = (e) => {
    const matId = parseInt(e.target.value);
    setSelectedMaterialId(matId);
    setSelectedGradeId('');
    const matObj = filteredMaterials.find(item => item.id === matId);
    setFilteredGrades(matObj ? matObj.grades : []);
  };

  // --- 4. SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Validation
    if (!selectedCategoryId || !selectedMaterialId || !selectedLocationId || !pricePerMT) {
        setErrorMsg("Please select Category, Material, Location and enter a Price.");
        setLoading(false);
        return;
    }

    try {
        // Construct Payload matches app/schemas/market_data.py
        const payload = {
            category_id: parseInt(selectedCategoryId),
            material_id: parseInt(selectedMaterialId),
            grade_id: selectedGradeId ? parseInt(selectedGradeId) : null,
            location_id: parseInt(selectedLocationId),
            price_per_mt: parseFloat(pricePerMT)
        };

        // POST call to Python Backend
        await axios.post('https://scrapcy-backend-new-1.onrender.com/market-prices/add', payload);

        setSuccessMsg("Market Price recorded successfully.");
        
        // Reset Price only (keep selections for faster data entry)
        setPricePerMT('');
    } catch (err) {
        console.error("Submission Error:", err);
        const serverError = err.response?.data?.detail || 'Failed to record price.';
        setErrorMsg(serverError);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      <div className="bg-navy text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
            <Link to="/admin" className="text-orange hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-2">
                <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                <TrendingUp size={32} className="text-orange" /> Market Price Entry
            </h1>
            <p className="text-gray-300 text-sm font-medium mt-1 flex items-center gap-2">
                <Lock size={12} /> Secure Admin Area • Update Daily Scrap Rates
            </p>
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-4 w-full -mt-6 pb-20 relative z-10">
        <div className="bg-white p-8 shadow-2xl rounded-lg border-t-8 border-orange">
            
            {successMsg && (
                <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 font-bold flex items-center gap-2">
                    <CheckCircle size={20} /> {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold flex items-center gap-2">
                    <XCircle size={20} /> {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Material Selection */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <LayoutDashboard size={16} /> Select Material
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Scrap Type</label>
                            <select value={selectedScrapType} onChange={handleScrapTypeChange} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none">
                                <option value="">-- Select Type --</option>
                                {[...new Set(hierarchy.map(item => item.scrap_type))].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Category</label>
                            <select value={selectedCategoryId} onChange={handleCategoryChange} disabled={!selectedScrapType} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Category --</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.material_category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Material</label>
                            <select value={selectedMaterialId} onChange={handleMaterialChange} disabled={!selectedCategoryId} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Material --</option>
                                {filteredMaterials.map(mat => (
                                    <option key={mat.id} value={mat.id}>{mat.material_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Grade</label>
                            <select value={selectedGradeId} onChange={(e) => setSelectedGradeId(e.target.value)} disabled={!selectedMaterialId} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Grade (Optional) --</option>
                                {filteredGrades.map(grad => (
                                    <option key={grad.id} value={grad.id}>{grad.grade_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Location & Price */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <MapPin size={16} /> Market Data
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Location</label>
                            <select 
                                value={selectedLocationId} 
                                onChange={(e) => setSelectedLocationId(e.target.value)} 
                                className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none"
                            >
                                <option value="">-- Select Location --</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.city ? `${loc.city}, ` : ''}{loc.state ? `${loc.state} ` : ''}({loc.location_name})
                                    </option>
                                ))}
                            </select>
                            {locations.length === 0 && <p className="text-xs text-red-500 mt-1">* No locations found. Check API.</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Price (Per Metric Ton)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-steel text-sm">₹</span>
                                <input 
                                    type="number" 
                                    value={pricePerMT} 
                                    onChange={(e) => setPricePerMT(e.target.value)} 
                                    className="w-full p-3 pl-8 bg-white border border-platinum rounded focus:border-orange outline-none font-bold text-navy"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-navy text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-orange transition-all flex justify-center items-center gap-2"
                >
                    {loading ? 'Recording...' : <><Save size={18} /> Record Market Price</>}
                </button>
            </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminMarketPrice;
