import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, Building2, Mail, Phone, FileText, ChevronDown, AlertCircle } from 'lucide-react';

const PostRequirementModal = ({ isOpen, onClose, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- 1. MASTER DATA STATE ---
  const [hierarchy, setHierarchy] = useState([]); // Full Tree from /categories/hierarchy

  // Selection States (To filter dropdowns)
  const [selectedScrapType, setSelectedScrapType] = useState(''); 
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 

  const [filteredMaterials, setFilteredMaterials] = useState([]); 
  const [selectedMaterialId, setSelectedMaterialId] = useState(''); 

  const [filteredForms, setFilteredForms] = useState([]); 
  const [selectedFormId, setSelectedFormId] = useState(''); 

  const [filteredGrades, setFilteredGrades] = useState([]); 
  const [selectedGradeId, setSelectedGradeId] = useState(''); 

  // --- 2. FORM STATE ---
  const [formData, setFormData] = useState({
    scrapType: '',
    category: '',
    material: '',
    form: '',
    grade: '',
    locations: '',
    description: '',
    note: '',
    // Guest Fields
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestCompany: '',
    guestGst: ''
  });

  // --- 3. MANUAL ENTRY MODE STATE ---
  // If true, renders an input field instead of select
  const [manualMode, setManualMode] = useState({
    scrapType: false,
    category: false,
    material: false,
    form: false,
    grade: false
  });

  const hierarchyKeys = ['scrapType', 'category', 'material', 'form', 'grade'];

  // --- FETCH MASTER DATA ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      fetchMasterData();
    }
  }, [isOpen]);

  const fetchMasterData = async () => {
    setDataLoading(true);
    try {
        const res = await axios.get('https://scrapcy-backend-new-1.onrender.com/categories/hierarchy');
        if (Array.isArray(res.data) && res.data.length > 0) {
            setHierarchy(res.data);
        } else {
            console.warn("API returned empty hierarchy data.");
            setHierarchy([]); // Handle empty state
        }
    } catch (err) {
        console.error("Master data fetch error", err);
        setHierarchy([]); // Allow manual entry if API fails
    } finally {
        setDataLoading(false);
    }
  };

  // --- CASCADING DROPDOWN HANDLERS ---

  const handleScrapTypeChange = (e) => {
    const val = e.target.value;
    
    // Reset lower levels
    setSelectedCategoryId(''); setFilteredCategories([]);
    setSelectedMaterialId(''); setFilteredMaterials([]);
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);
    
    // Reset Manual Modes below
    setManualMode(prev => ({ ...prev, category: false, material: false, form: false, grade: false }));

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, scrapType: true, category: true, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, scrapType: '' })); // Clear for typing
    } else {
        setSelectedScrapType(val);
        setFormData(prev => ({ ...prev, scrapType: val }));
        
        // Filter Categories
        const categories = hierarchy.filter(item => item.scrap_type === val);
        setFilteredCategories(categories || []);
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    
    // Reset lower levels
    setSelectedMaterialId(''); setFilteredMaterials([]);
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, category: true, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, category: '' }));
    } else {
        const catId = parseInt(val);
        setSelectedCategoryId(catId);
        
        const catObj = hierarchy.find(item => item.id === catId);
        if (catObj) {
            setFormData(prev => ({ ...prev, category: catObj.material_category })); // Store Name, not ID
            setFilteredMaterials(catObj.materials || []);
        }
    }
  };

  const handleMaterialChange = (e) => {
    const val = e.target.value;
    
    setSelectedFormId('');     setFilteredForms([]);
    setSelectedGradeId('');    setFilteredGrades([]);

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, material: '' }));
    } else {
        const matId = parseInt(val);
        setSelectedMaterialId(matId);
        
        const matObj = filteredMaterials.find(item => item.id === matId);
        if (matObj) {
            setFormData(prev => ({ ...prev, material: matObj.material_name }));
            setFilteredForms(matObj.forms || []);
        }
    }
  };

  const handleFormChange = (e) => {
    const val = e.target.value;
    
    setSelectedGradeId('');    setFilteredGrades([]);

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, form: true, grade: true }));
        setFormData(prev => ({ ...prev, form: '' }));
    } else {
        const fId = parseInt(val);
        setSelectedFormId(fId);
        
        const formObj = filteredForms.find(item => item.id === fId);
        if (formObj) {
            setFormData(prev => ({ ...prev, form: formObj.form_name }));
            setFilteredGrades(formObj.grades || []);
        }
    }
  };

  const handleGradeChange = (e) => {
    const val = e.target.value;
    
    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, grade: true }));
        setFormData(prev => ({ ...prev, grade: '' }));
    } else {
        const gId = parseInt(val);
        setSelectedGradeId(gId);
        
        const gradeObj = filteredGrades.find(item => item.id === gId);
        if (gradeObj) {
            setFormData(prev => ({ ...prev, grade: gradeObj.grade_name }));
        }
    }
  };

  // --- GENERIC INPUT HANDLER ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Guest Validation
    if (!isAuthenticated) {
        if(!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.guestCompany || !formData.guestGst) {
            setError("All guest details are mandatory.");
            setLoading(false);
            return;
        }
    }

    try {
      const payload = { ...formData };
      
      // Simulate API Call (Replace with real endpoint later)
      // await axios.post('https://scrapcy-backend-new-1.onrender.com/requirements/create', payload);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Requirement Posted:", payload);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        // Reset Everything
        setFormData({
            scrapType: '', category: '', material: '', form: '', grade: '', locations: '', description: '', note: '',
            guestName: '', guestEmail: '', guestPhone: '', guestCompany: '', guestGst: ''
        });
        setManualMode({ scrapType: false, category: false, material: false, form: false, grade: false });
        
        setSelectedScrapType(''); setFilteredCategories([]);
        setSelectedCategoryId(''); setFilteredMaterials([]);
        setSelectedMaterialId(''); setFilteredForms([]);
        setSelectedFormId('');     setFilteredGrades([]);
        setSelectedGradeId('');

      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Failed to post requirement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-navy p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Post Requirement</h2>
            <p className="text-orange text-xs font-bold uppercase tracking-widest">Open RFQ to Market</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-scaleIn">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Send size={40} />
              </div>
              <h3 className="text-2xl font-bold text-navy">Requirement Posted!</h3>
              <p className="text-steel mt-2">Sellers matching your criteria will be notified.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: SCRAP DETAILS */}
              <div>
                <h3 className="text-sm font-black text-navy uppercase border-b-2 border-platinum pb-2 mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-orange"/> Scrap Details
                </h3>
                
                {/* No Data Warning */}
                {hierarchy.length === 0 && !dataLoading && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-xs font-bold rounded flex items-center gap-2">
                        <AlertCircle size={16}/> Warning: Unable to load categories. Please type manually using 'Others'.
                    </div>
                )}

                {/* Dynamic Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* 1. Scrap Type */}
                  <div className="relative">
                    {manualMode.scrapType ? (
                        <input name="scrapType" value={formData.scrapType} onChange={handleInputChange} placeholder="Scrap Type (Manual)" className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required autoFocus />
                    ) : (
                        <select onChange={handleScrapTypeChange} value={selectedScrapType} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer" required disabled={dataLoading}>
                            <option value="">{dataLoading ? "Loading..." : "Select Scrap Type"}</option>
                            {[...new Set(hierarchy.map(item => item.scrap_type))].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others (Add New)</option>
                        </select>
                    )}
                  </div>

                  {/* 2. Category */}
                  <div className="relative">
                    {manualMode.category ? (
                        <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category (Manual)" className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                    ) : (
                        <select onChange={handleCategoryChange} value={selectedCategoryId} disabled={!selectedScrapType} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Category</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.material_category}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* 3. Material */}
                  <div className="relative">
                    {manualMode.material ? (
                        <input name="material" value={formData.material} onChange={handleInputChange} placeholder="Material (Manual)" className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                    ) : (
                        <select onChange={handleMaterialChange} value={selectedMaterialId} disabled={!selectedCategoryId} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Material</option>
                            {filteredMaterials.map(mat => (
                                <option key={mat.id} value={mat.id}>{mat.material_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* 4. Form */}
                  <div className="relative">
                    {manualMode.form ? (
                        <input name="form" value={formData.form} onChange={handleInputChange} placeholder="Form (Manual)" className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                    ) : (
                        <select onChange={handleFormChange} value={selectedFormId} disabled={!selectedMaterialId} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Form</option>
                            {(filteredForms || []).map(form => (
                                <option key={form.id} value={form.id}>{form.form_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* 5. Grade */}
                  <div className="relative">
                    {manualMode.grade ? (
                        <input name="grade" value={formData.grade} onChange={handleInputChange} placeholder="Grade (Manual)" className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                    ) : (
                        <select onChange={handleGradeChange} value={selectedGradeId} disabled={!selectedFormId || filteredGrades.length === 0} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100">
                            <option value="">Select Grade</option>
                            {(filteredGrades || []).map(grad => (
                                <option key={grad.id} value={grad.id}>{grad.grade_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>
                  
                  {/* Location is always input */}
                  <input 
                    name="locations" 
                    value={formData.locations} 
                    onChange={handleInputChange} 
                    placeholder="Preferred Locations (Comma separated)" 
                    className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed Description (Qty, Specs, etc.)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none h-24 resize-none" required />
                    <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Note to Seller (Optional)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none h-24 resize-none" />
                </div>
              </div>

              {/* SECTION 2: GUEST DETAILS (Only if not logged in) */}
              {!isAuthenticated && (
                <div className="animate-fadeIn">
                  <h3 className="text-sm font-black text-navy uppercase border-b-2 border-platinum pb-2 mb-4 flex items-center gap-2">
                    <User size={16} className="text-orange"/> Your Details
                  </h3>
                  <div className="bg-orange/5 border border-orange/20 p-4 rounded-lg mb-4">
                    <p className="text-xs text-orange font-bold uppercase tracking-wide">
                        Please provide your contact info so sellers can reach you.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestName" value={formData.guestName} onChange={handleInputChange} placeholder="Full Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestEmail" value={formData.guestEmail} onChange={handleInputChange} placeholder="Email Address" type="email" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestPhone" value={formData.guestPhone} onChange={handleInputChange} placeholder="Phone Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestCompany" value={formData.guestCompany} onChange={handleInputChange} placeholder="Company Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative md:col-span-2">
                        <FileText size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestGst" value={formData.guestGst} onChange={handleInputChange} placeholder="GST Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}

              {/* Submit Action */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-navy text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Open RFQ"}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostRequirementModal;
