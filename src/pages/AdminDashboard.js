import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, 
  Users, MapPin, TrendingUp, Gavel, PlusCircle, List, Trash2, Grid, Table as TableIcon
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ==========================================
// SUB-COMPONENT: LISTINGS VIEW (Card & List)
// ==========================================
const ListingsView = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/scrap/all`); 
      setListings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Listings Error", err);
      setListings([]); 
      setError('Could not load listings. Please check API connection.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
        await axios.delete(`${API_URL}/scrap/${id}`);
        setListings(listings.filter(item => item.id !== id));
    } catch (err) {
        alert("Failed to delete listing");
    }
  };

  // Helper to handle image source safely
  const getImageUrl = (item) => {
      if (item.images && item.images.length > 0) {
          return item.images[0]; 
      }
      return null; 
  };

  if (loading) return <div className="p-8 text-center text-navy font-bold">Loading Listings...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-navy animate-fadeIn">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-black text-navy uppercase flex items-center gap-2">
            <List className="text-orange" /> All Scrap Listings
        </h2>
        
        <div className="flex items-center gap-4">
            <span className="text-steel text-sm font-bold">{listings.length} Records</span>
            {/* View Toggle Buttons */}
            <div className="bg-platinum p-1 rounded flex">
                <button 
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded ${viewMode === 'card' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}
                    title="Card View"
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow text-orange' : 'text-steel hover:text-navy'}`}
                    title="List View"
                >
                    <TableIcon size={18} />
                </button>
            </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 font-bold mb-4 rounded">{error}</div>}

      {/* --- CARD VIEW (WITH IMAGES) --- */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length > 0 ? (
                listings.map(item => {
                    const imgUrl = getImageUrl(item);
                    return (
                        <div key={item.id} className="border border-platinum rounded-lg overflow-hidden hover:shadow-xl hover:border-orange transition-all bg-white group flex flex-col">
                             {/* IMAGE SECTION */}
                             <div className="h-48 w-full bg-gray-200 relative">
                                {imgUrl ? (
                                    <img 
                                        src={imgUrl} 
                                        alt={item.material_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {e.target.style.display='none'}} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <FileText size={40} />
                                    </div>
                                )}
                                <span className="absolute top-2 left-2 bg-navy/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm shadow-sm">
                                    {item.scrap_type}
                                </span>
                             </div>

                             {/* CONTENT SECTION */}
                             <div className="p-5 flex-grow flex flex-col">
                                 <div className="flex justify-between items-start mb-2">
                                     <h3 className="text-lg font-black text-navy uppercase leading-tight line-clamp-1" title={item.material_name}>
                                        {item.material_name}
                                     </h3>
                                     <button onClick={() => handleDelete(item.id)} className="text-platinum hover:text-red-500 transition-colors" title="Delete">
                                        <Trash2 size={16}/>
                                     </button>
                                 </div>
                                 <p className="text-xs font-bold text-steel mb-4 line-clamp-1">{item.company_name}</p>
                                 
                                 <div className="mt-auto pt-4 border-t border-platinum flex justify-between items-end">
                                     <div>
                                         <p className="text-[10px] text-steel uppercase font-bold">Quantity</p>
                                         <p className="text-sm font-black text-navy">{item.quantity} {item.unit}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-[10px] text-steel uppercase font-bold">Price</p>
                                         <p className="text-lg font-black text-green-600">₹{item.price_per_unit}</p>
                                     </div>
                                 </div>
                                 <div className="mt-3 text-[10px] text-steel flex items-center gap-1">
                                     <MapPin size={12}/> {item.location_city || 'Location N/A'}
                                 </div>
                             </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-full text-center py-10 text-gray-400">No listings found.</div>
            )}
        </div>
      )}

      {/* --- LIST VIEW --- */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-platinum/50 text-navy uppercase text-xs font-black">
                <th className="p-4 border-b border-platinum">ID</th>
                <th className="p-4 border-b border-platinum">Img</th>
                <th className="p-4 border-b border-platinum">Seller</th>
                <th className="p-4 border-b border-platinum">Material</th>
                <th className="p-4 border-b border-platinum">Qty</th>
                <th className="p-4 border-b border-platinum">Price</th>
                <th className="p-4 border-b border-platinum">Location</th>
                <th className="p-4 border-b border-platinum">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm font-medium text-steel">
                {listings.map((item) => {
                    const imgUrl = getImageUrl(item);
                    return (
                        <tr key={item.id} className="hover:bg-orange/5 transition-colors">
                            <td className="p-4 border-b border-platinum">#{item.id}</td>
                            <td className="p-4 border-b border-platinum">
                                <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden border border-platinum">
                                    {imgUrl && <img src={imgUrl} className="h-full w-full object-cover" alt="" onError={(e)=>{e.target.style.display='none'}}/>}
                                </div>
                            </td>
                            <td className="p-4 border-b border-platinum font-bold text-navy">{item.company_name}</td>
                            <td className="p-4 border-b border-platinum">{item.material_name}</td>
                            <td className="p-4 border-b border-platinum">{item.quantity} {item.unit}</td>
                            <td className="p-4 border-b border-platinum text-green-600 font-bold">{item.price_per_unit}</td>
                            <td className="p-4 border-b border-platinum">{item.location_city}</td>
                            <td className="p-4 border-b border-platinum">
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: ADD LISTING FORM
// ==========================================
const AddListingForm = ({ hierarchy }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown States
  const [selectedScrapType, setSelectedScrapType] = useState(''); 
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 

  const [filteredMaterials, setFilteredMaterials] = useState([]); 
  const [selectedMaterialId, setSelectedMaterialId] = useState(''); 

  const [filteredForms, setFilteredForms] = useState([]); 
  const [selectedFormId, setSelectedFormId] = useState(''); 

  const [filteredGrades, setFilteredGrades] = useState([]); 
  const [selectedGradeId, setSelectedGradeId] = useState(''); 

  // Form State
  const [formData, setFormData] = useState({
    sellerName: 'Admin Entry',
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    alternatePhone: '',
    description: '',
    quantity: '',
    quantityUnit: 'Tons',
    monthlyCapacity: '', 
    pricePerUnit: '',
    priceUnit: 'Per Ton',
    address: '',
    pickupConditions: '',
    addedBy: 'admin'
  });

  const [selectedFiles, setSelectedFiles] = useState(null);

  // --- DROPDOWN LOGIC ---
  const handleScrapTypeChange = (e) => {
    const type = e.target.value;
    setSelectedScrapType(type);
    setSelectedCategoryId(''); setFilteredCategories([]);
    setSelectedMaterialId(''); setFilteredMaterials([]);
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);
    
    if (!type) return;
    const categories = hierarchy.filter(item => item.scrap_type === type);
    setFilteredCategories(categories || []);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const catId = val ? parseInt(val) : '';
    setSelectedCategoryId(catId);
    setSelectedMaterialId(''); setFilteredMaterials([]);
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);

    if (!catId) return;
    const catObj = hierarchy.find(item => item.id === catId);
    setFilteredMaterials(catObj?.materials || []); 
  };

  const handleMaterialChange = (e) => {
    const val = e.target.value;
    const matId = val ? parseInt(val) : '';
    setSelectedMaterialId(matId);
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);

    if (!matId) return;
    const matObj = filteredMaterials.find(item => item.id === matId);
    setFilteredForms(matObj?.forms || []); 
  };

  const handleFormChange = (e) => {
    const val = e.target.value;
    const fId = val ? parseInt(val) : '';
    setSelectedFormId(fId);
    setSelectedGradeId('');    setFilteredGrades([]);

    if (!fId) return;
    const formObj = filteredForms.find(item => item.id === fId);
    setFilteredGrades(formObj?.grades || []); 
  };

  // --- UNIT LOGIC ---
  useEffect(() => {
    if (formData.quantityUnit === 'Tons') {
      if (formData.priceUnit !== 'Per Ton' && formData.priceUnit !== 'Per Kg') {
        setFormData(prev => ({ ...prev, priceUnit: 'Per Ton' }));
      }
    } else if (formData.quantityUnit === 'Kg') {
      setFormData(prev => ({ ...prev, priceUnit: 'Per Kg' }));
    } else if (formData.quantityUnit === 'Liters') {
      setFormData(prev => ({ ...prev, priceUnit: 'Per Liter' }));
    }
  }, [formData.quantityUnit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errorMsg) setErrorMsg(''); 
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
        setErrorMsg("Maximum 5 images allowed.");
        e.target.value = null; 
        setSelectedFiles(null);
        return;
    }
    setSelectedFiles(files);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedCategoryId || !selectedMaterialId) {
        setErrorMsg("Please complete the material classification (Category & Material Name).");
        setLoading(false);
        return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
        setErrorMsg("At least 1 image is mandatory.");
        setLoading(false);
        return;
    }

    try {
      const data = new FormData();
      data.append('seller_name', formData.sellerName);
      data.append('company_name', formData.companyName || "");
      data.append('gst_number', formData.gstNumber || "");
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if(formData.alternatePhone) data.append('alternate_phone', formData.alternatePhone);
      data.append('category_id', selectedCategoryId);
      data.append('material_id', selectedMaterialId);
      if(selectedFormId) data.append('form_id', selectedFormId);
      if(selectedGradeId) data.append('grade_id', selectedGradeId);
      if(formData.description) data.append('description', formData.description);
      data.append('quantity', formData.quantity ? formData.quantity.toString() : "0");
      data.append('unit', formData.quantityUnit);
      if(formData.monthlyCapacity) data.append('monthly_capacity', formData.monthlyCapacity);
      data.append('price_per_unit', formData.pricePerUnit ? formData.pricePerUnit.toString() : "0");
      data.append('price_unit', formData.priceUnit);
      data.append('address', formData.address);
      if(formData.pickupConditions) data.append('pickup_conditions', formData.pickupConditions);
      data.append('added_by', 'admin');

      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('images', selectedFiles[i]);
      }

      const response = await axios.post(
        `${API_URL}/scrap/add`, 
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccessMsg(`Success! Listing ID: ${response.data.listing_id} created.`);
      setFormData({
        sellerName: 'Admin Entry', companyName: '', gstNumber: '', email: '', phone: '', alternatePhone: '',
        description: '', quantity: '', quantityUnit: 'Tons', 
        monthlyCapacity: '', 
        pricePerUnit: '', priceUnit: 'Per Ton', address: '', pickupConditions: '',
        addedBy: 'admin'
      });
      setSelectedFiles(null);
      setSelectedScrapType('');
      setSelectedCategoryId('');
      setSelectedMaterialId('');
      setSelectedFormId('');
      setSelectedGradeId('');
      document.getElementById('fileInput').value = ""; 
    } catch (err) {
      console.error("Submission Error:", err);
      const serverError = err.response?.data?.detail || 'Failed to create listing.';
      setErrorMsg(typeof serverError === 'string' ? serverError : JSON.stringify(serverError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-2xl rounded-lg border-t-8 border-orange animate-fadeIn">
        <h2 className="text-2xl font-black text-navy uppercase mb-6 flex items-center gap-2">
            <PlusCircle className="text-orange" /> Add New Scrap Listing
        </h2>

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
            {/* --- SELLER DETAILS --- */}
            <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                    <Users size={16} /> Seller Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Company Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">GST Number</label>
                        <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Alt. Phone</label>
                            <input name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LOCATION INFO --- */}
            <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                    <MapPin size={16} /> Location & Pickup
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Detailed Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="Full pickup address..." required></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Pickup Notes</label>
                        <input name="pickupConditions" value={formData.pickupConditions} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="e.g. 24ft Truck entry available..." />
                    </div>
                </div>
            </div>

            {/* --- MATERIAL CLASSIFICATION --- */}
            <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                    <LayoutDashboard size={16} /> Material Classification
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Level 1: Scrap Type */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">1. Scrap Type</label>
                        <select value={selectedScrapType} onChange={handleScrapTypeChange} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none cursor-pointer">
                            <option value="">-- Select Type --</option>
                            {[...new Set(hierarchy.map(item => item.scrap_type))].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level 2: Category */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">2. Category</label>
                        <select value={selectedCategoryId} onChange={handleCategoryChange} disabled={!selectedScrapType} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100 cursor-pointer">
                            <option value="">-- Select Category --</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.material_category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level 3: Material */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">3. Material Name</label>
                        <select value={selectedMaterialId} onChange={handleMaterialChange} disabled={!selectedCategoryId} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100 cursor-pointer">
                            <option value="">-- Select Material --</option>
                            {filteredMaterials.map(mat => (
                                <option key={mat.id} value={mat.id}>{mat.material_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level 4: Form */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">4. Form</label>
                        <select value={selectedFormId} onChange={handleFormChange} disabled={!selectedMaterialId} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100 cursor-pointer">
                            <option value="">-- Select Form --</option>
                            {(filteredForms || []).map(form => (
                                <option key={form.id} value={form.id}>{form.form_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level 5: Grade */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">5. Grade (Optional)</label>
                        <select value={selectedGradeId} onChange={(e) => setSelectedGradeId(e.target.value)} disabled={!selectedFormId || filteredGrades.length === 0} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none disabled:bg-gray-100 cursor-pointer">
                            <option value="">-- Select Grade --</option>
                            {(filteredGrades || []).map(grad => (
                                <option key={grad.id} value={grad.id}>{grad.grade_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-navy mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="Condition, attachments, etc."></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Quantity</label>
                        <div className="flex">
                            <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" step="0.01" className="w-2/3 p-3 bg-white border border-r-0 border-platinum rounded-l focus:border-orange outline-none" required />
                            <select name="quantityUnit" value={formData.quantityUnit} onChange={handleChange} className="w-1/3 p-3 bg-gray-100 border border-l-0 border-platinum rounded-r text-xs font-bold focus:border-orange outline-none cursor-pointer">
                                <option value="Tons">Tons</option>
                                <option value="Kg">Kg</option>
                                <option value="Liters">Liters</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Price</label>
                        <div className="flex">
                            <input name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} type="number" step="0.01" className="w-2/3 p-3 bg-white border border-r-0 border-platinum rounded-l focus:border-orange outline-none" required />
                            <select name="priceUnit" value={formData.priceUnit} onChange={handleChange} className="w-1/3 p-3 bg-gray-100 border border-l-0 border-platinum rounded-r text-xs font-bold focus:border-orange outline-none cursor-pointer">
                                {formData.quantityUnit === 'Tons' ? (
                                    <>
                                        <option value="Per Ton">/ Ton</option>
                                        <option value="Per Kg">/ Kg</option>
                                    </>
                                ) : formData.quantityUnit === 'Kg' ? (
                                    <option value="Per Kg">/ Kg</option>
                                ) : (
                                    <option value="Per Liter">/ Liter</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- IMAGES --- */}
            <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                    <Upload size={16} /> Upload Images (Max 5)
                </h3>
                <div className="border-2 border-dashed border-steel/30 bg-white rounded-lg p-8 text-center hover:bg-orange/5 transition-colors">
                    <input 
                        id="fileInput"
                        type="file" 
                        multiple 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-navy file:text-white
                        hover:file:bg-orange cursor-pointer"
                    />
                    <p className="text-xs text-steel mt-2">Supports JPG, PNG (Max 5MB) - Minimum 1 Required</p>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-navy text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-orange transition-all flex justify-center items-center gap-2"
            >
                {loading ? 'Processing...' : <><Save size={18} /> Save Listing</>}
            </button>
        </form>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT: ADMIN DASHBOARD (SHELL)
// ==========================================
const AdminDashboard = () => {
  // --- 1. Main Navigation State ---
  const [mainTab, setMainTab] = useState('listings'); // 'listings' | 'auction' | 'market'
  
  // --- 2. Sub-Tab State ---
  const [subTab, setSubTab] = useState('all_listings'); // Default load

  const [hierarchy, setHierarchy] = useState([]);
  
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories/hierarchy`);
        setHierarchy(res.data);
      } catch (err) {
        console.error("Master data fetch error", err);
      }
    };
    fetchMasterData();
  }, []);

  // --- TAB HELPERS ---
  const MainTabButton = ({ id, label, icon: Icon }) => (
    <button
        onClick={() => {
            setMainTab(id);
            if(id === 'listings') setSubTab('all_listings');
            if(id === 'auction') setSubTab('dashboard');
        }}
        className={`flex items-center gap-2 px-6 py-4 font-black uppercase text-sm tracking-widest transition-all w-full md:w-auto justify-center md:justify-start
            ${mainTab === id 
                ? 'bg-orange text-white shadow-lg transform -translate-y-1' 
                : 'bg-navy/90 text-white hover:bg-navy'
            }
        `}
    >
        <Icon size={18} /> {label}
    </button>
  );

  const SubTabButton = ({ id, label }) => (
    <button
        onClick={() => setSubTab(id)}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all border-2 
            ${subTab === id 
                ? 'bg-navy text-white border-navy' 
                : 'bg-white text-steel border-platinum hover:border-navy hover:text-navy'
            }
        `}
    >
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* --- HEADER BANNER --- */}
      <div className="bg-navy text-white pt-10 pb-20 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Admin Console</h1>
            <p className="text-orange text-sm font-bold uppercase tracking-widest mb-8">
                System Administrator
            </p>

            {/* --- MAIN TABS (The 3 Headers) --- */}
            <div className="flex flex-col md:flex-row gap-4 border-b border-white/20 pb-1">
                <MainTabButton id="listings" label="Scrap Listings" icon={List} />
                <MainTabButton id="auction" label="E-Auction" icon={Gavel} />
                <MainTabButton id="market" label="Market Prices" icon={TrendingUp} />
            </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-12 pb-20 relative z-10">
        
        {/* --- SUB-NAVIGATION BAR --- */}
        <div className="bg-white p-4 rounded-t-lg border-b border-platinum flex gap-3 overflow-x-auto shadow-sm">
            {mainTab === 'listings' && (
                <>
                    <SubTabButton id="all_listings" label="All Listings" />
                    <SubTabButton id="add_listing" label="Add New Listing" />
                </>
            )}
            {mainTab === 'auction' && (
                <>
                    <SubTabButton id="dashboard" label="Admin Dashboard" />
                    <SubTabButton id="register" label="Register Auction" />
                    <SubTabButton id="my_auctions" label="My Auctions" />
                </>
            )}
            {mainTab === 'market' && (
                <div className="text-sm font-bold text-navy uppercase">Market Price Management</div>
            )}
        </div>

        {/* --- DYNAMIC CONTENT RENDER --- */}
        <div className="bg-white min-h-[600px] shadow-2xl rounded-b-lg p-0">
            
            {/* 1. LISTINGS SECTION */}
            {mainTab === 'listings' && (
                <div className="p-4">
                    {subTab === 'all_listings' && <ListingsView />}
                    {subTab === 'add_listing' && <AddListingForm hierarchy={hierarchy} />}
                </div>
            )}

            {/* 2. E-AUCTION SECTION (Placeholder Redirects) */}
            {mainTab === 'auction' && (
                <div className="p-12 text-center">
                    <h2 className="text-2xl font-black text-navy uppercase mb-4">E-Auction Management</h2>
                    <p className="text-steel mb-8">Access the specific modules below:</p>
                    
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Link to="/e-auction/admin/dashboard" className="p-8 border-2 border-platinum rounded-xl hover:border-orange hover:shadow-xl transition-all group">
                            <LayoutDashboard size={40} className="text-navy group-hover:text-orange mx-auto mb-4"/>
                            <h3 className="font-black text-navy uppercase">Auction Dashboard</h3>
                        </Link>
                        <Link to="/e-auction/register" className="p-8 border-2 border-platinum rounded-xl hover:border-orange hover:shadow-xl transition-all group">
                            <PlusCircle size={40} className="text-navy group-hover:text-orange mx-auto mb-4"/>
                            <h3 className="font-black text-navy uppercase">Create Auction</h3>
                        </Link>
                        <Link to="/e-auction/my-auctions" className="p-8 border-2 border-platinum rounded-xl hover:border-orange hover:shadow-xl transition-all group">
                            <FileText size={40} className="text-navy group-hover:text-orange mx-auto mb-4"/>
                            <h3 className="font-black text-navy uppercase">My Auctions</h3>
                        </Link>
                    </div>
                </div>
            )}

            {/* 3. MARKET PRICE SECTION */}
            {mainTab === 'market' && (
                <div className="p-12 text-center">
                    <TrendingUp size={64} className="text-orange mx-auto mb-6"/>
                    <h2 className="text-3xl font-black text-navy uppercase mb-4">Market Prices</h2>
                    <p className="text-steel mb-8">Manage daily mandi rates and price trends here.</p>
                    <Link to="/admin/market-prices" className="bg-navy text-white px-8 py-4 font-bold uppercase rounded shadow hover:bg-orange transition-colors">
                        Go to Price Manager
                    </Link>
                </div>
            )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
