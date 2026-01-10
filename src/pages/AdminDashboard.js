import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, Users, MapPin 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // --- 1. MASTER DATA STATE ---
  const [hierarchy, setHierarchy] = useState([]); // Full Tree
  
  // Selection State
  const [selectedScrapType, setSelectedScrapType] = useState(''); // Level 1 (Metal/Plastic)
  const [filteredCategories, setFilteredCategories] = useState([]); // Level 2 List
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Level 2 ID
  
  const [filteredMaterials, setFilteredMaterials] = useState([]); // Level 3 List
  const [selectedMaterialId, setSelectedMaterialId] = useState(''); // Level 3 ID
  
  const [filteredGrades, setFilteredGrades] = useState([]); // Level 4 List
  const [selectedGradeId, setSelectedGradeId] = useState(''); // Level 4 ID

  // Form State (Removed scrapType and grade as they are now handled by dropdowns)
  const [formData, setFormData] = useState({
    sellerName: 'Admin Entry', companyName: '', gstNumber: '', email: '', phone: '', alternatePhone: '',
    description: '', quantity: '', quantityUnit: 'Tons', monthlyCapacity: '', 
    pricePerUnit: '', priceUnit: 'Per Ton', address: '', pickupConditions: '', addedBy: 'admin'
  });

  const [selectedFiles, setSelectedFiles] = useState(null);

  // --- FETCH MASTER DATA ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await axios.get('https://scrapcy-backend-new-1.onrender.com/categories/hierarchy');
        setHierarchy(res.data);
      } catch (err) {
        console.error("Master data fetch error", err);
      }
    };
    fetchMasterData();
  }, []);

  // --- DROPDOWN HANDLERS ---
  
  // Level 1 Change
  const handleScrapTypeChange = (e) => {
    const type = e.target.value;
    setSelectedScrapType(type);
    // Reset Downstream
    setSelectedCategoryId(''); setFilteredMaterials([]);
    setSelectedMaterialId(''); setFilteredGrades([]);
    setSelectedGradeId('');
    // Filter Categories
    const categories = hierarchy.filter(item => item.scrap_type === type);
    setFilteredCategories(categories);
  };

  // Level 2 Change
  const handleCategoryChange = (e) => {
    const catId = parseInt(e.target.value);
    setSelectedCategoryId(catId);
    // Reset Downstream
    setSelectedMaterialId(''); setFilteredGrades([]);
    setSelectedGradeId('');
    // Find Materials
    const catObj = hierarchy.find(item => item.id === catId);
    setFilteredMaterials(catObj ? catObj.materials : []);
  };

  // Level 3 Change
  const handleMaterialChange = (e) => {
    const matId = parseInt(e.target.value);
    setSelectedMaterialId(matId);
    // Reset Downstream
    setSelectedGradeId('');
    // Find Grades
    const matObj = filteredMaterials.find(item => item.id === matId);
    setFilteredGrades(matObj ? matObj.grades : []);
  };

  // --- STANDARD HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setSelectedFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccessMsg(''); setErrorMsg('');

    if (!selectedCategoryId || !selectedMaterialId) {
        setErrorMsg("Please complete the material classification selection.");
        setLoading(false); return;
    }
    if (!selectedFiles || selectedFiles.length === 0) {
        setErrorMsg("At least 1 image is mandatory.");
        setLoading(false); return;
    }

    try {
      const data = new FormData();
      // Seller
      data.append('seller_name', formData.sellerName);
      data.append('company_name', formData.companyName);
      data.append('gst_number', formData.gstNumber);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if(formData.alternatePhone) data.append('alternate_phone', formData.alternatePhone);

      // --- NEW ID FIELDS ---
      data.append('category_id', selectedCategoryId);
      data.append('material_id', selectedMaterialId);
      if(selectedGradeId) data.append('grade_id', selectedGradeId);
      
      // Other Details
      if(formData.description) data.append('description', formData.description);
      data.append('quantity', formData.quantity || "0");
      data.append('unit', formData.quantityUnit);
      if(formData.monthlyCapacity) data.append('monthly_capacity', formData.monthlyCapacity);
      data.append('price_per_unit', formData.pricePerUnit || "0");
      data.append('price_unit', formData.priceUnit);
      data.append('address', formData.address);
      if(formData.pickupConditions) data.append('pickup_conditions', formData.pickupConditions);
      data.append('added_by', 'admin');

      for (let i = 0; i < selectedFiles.length; i++) data.append('images', selectedFiles[i]);

      const response = await axios.post('https://scrapcy-backend-new-1.onrender.com/scrap/add', data, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccessMsg(`Success! Listing ID: ${response.data.listing_id} created.`);
      
      // Reset
      setFormData({ ...formData, description: '', quantity: '', monthlyCapacity: '', pricePerUnit: '', address: '' });
      setSelectedFiles(null);
      // Reset Dropdowns
      setSelectedScrapType(''); setSelectedCategoryId(''); setSelectedMaterialId(''); setSelectedGradeId('');
      document.getElementById('fileInput').value = "";

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div><h1 className="text-4xl font-black uppercase">Admin Console</h1></div>
            <Link to="/admin/listings" className="bg-orange text-white font-bold py-3 px-6 rounded uppercase text-xs">View Listings</Link>
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        <div className="bg-white p-8 shadow-2xl rounded-lg border-t-8 border-orange">
            <h2 className="text-2xl font-black text-navy uppercase mb-6">Add New Listing</h2>
            
            {successMsg && <div className="mb-4 p-4 bg-green-100 text-green-700 font-bold">{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-4 bg-red-100 text-red-700 font-bold">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Seller Info (Simplified for brevity, keep your full fields) */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4">Seller Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="p-3 border rounded w-full" required />
                        <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST" className="p-3 border rounded w-full" required />
                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-3 border rounded w-full" required />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="p-3 border rounded w-full" required />
                    </div>
                </div>

                {/* 2. CASCADING DROPDOWNS */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4">Material Classification</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        
                        {/* Level 1 */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">1. Scrap Type</label>
                            <select value={selectedScrapType} onChange={handleScrapTypeChange} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none">
                                <option value="">-- Select Type --</option>
                                {/* Get unique types */}
                                {[...new Set(hierarchy.map(i => i.scrap_type))].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Level 2 */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">2. Category</label>
                            <select value={selectedCategoryId} onChange={handleCategoryChange} disabled={!selectedScrapType} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Category --</option>
                                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.material_category}</option>)}
                            </select>
                        </div>

                        {/* Level 3 */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">3. Material Name</label>
                            <select value={selectedMaterialId} onChange={handleMaterialChange} disabled={!selectedCategoryId} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Material --</option>
                                {filteredMaterials.map(m => <option key={m.id} value={m.id}>{m.material_name}</option>)}
                            </select>
                        </div>

                        {/* Level 4 */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">4. Grade (Optional)</label>
                            <select value={selectedGradeId} onChange={(e) => setSelectedGradeId(e.target.value)} disabled={!selectedMaterialId || filteredGrades.length === 0} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100">
                                <option value="">-- Select Grade --</option>
                                {filteredGrades.map(g => <option key={g.id} value={g.id}>{g.grade_name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Additional Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full p-3 border rounded" placeholder="Condition, attachments, etc..."></textarea>
                    </div>
                </div>

                {/* 3. Quantity & Price (Keep your existing fields here) */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="p-3 border rounded w-full" required />
                        <input name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} placeholder="Price" type="number" className="p-3 border rounded w-full" required />
                        <input name="monthlyCapacity" value={formData.monthlyCapacity} onChange={handleChange} placeholder="Monthly Capacity (Optional)" className="p-3 border rounded w-full" />
                    </div>
                </div>

                {/* 4. Location & Image Upload (Keep existing logic) */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                     <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-3 border rounded w-full mb-4" required />
                     <input id="fileInput" type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-orange/10 file:text-orange cursor-pointer" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-navy text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-orange transition-all">
                    {loading ? 'Processing...' : 'Save Listing'}
                </button>

            </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
