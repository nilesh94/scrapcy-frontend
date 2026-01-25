import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, Building2, Mail, Phone, FileText, ChevronDown, AlertCircle, List } from 'lucide-react';

const PostRequirementModal = ({ isOpen, onClose, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- MASTER DATA ---
  const [hierarchy, setHierarchy] = useState([]); 
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [filteredMaterials, setFilteredMaterials] = useState([]); 
  const [filteredForms, setFilteredForms] = useState([]); 
  const [filteredGrades, setFilteredGrades] = useState([]); 

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    scrapType: '',
    category: '',
    material: '',
    form: '',
    grade: '',
    locations: '',
    description: '',
    note: '',
    guestName: '', guestEmail: '', guestPhone: '', guestCompany: '', guestGst: ''
  });

  // --- MANUAL MODE ---
  const [manualMode, setManualMode] = useState({
    scrapType: false, category: false, material: false, form: false, grade: false
  });

  const hierarchyKeys = ['scrapType', 'category', 'material', 'form', 'grade'];

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
        if (Array.isArray(res.data) && res.data.length > 0) setHierarchy(res.data);
        else setHierarchy([]); 
    } catch (err) {
        console.error("Master data error", err);
        setHierarchy([]); 
    } finally {
        setDataLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleToDropdown = (key) => {
    const startIndex = hierarchyKeys.indexOf(key);
    const newManualMode = { ...manualMode };
    const newFormData = { ...formData };

    for (let i = startIndex; i < hierarchyKeys.length; i++) {
        const fieldKey = hierarchyKeys[i];
        newManualMode[fieldKey] = false;
        newFormData[fieldKey] = ''; 
    }

    if (key === 'scrapType') { setFilteredCategories([]); setFilteredMaterials([]); setFilteredForms([]); setFilteredGrades([]); }
    if (key === 'category') { setFilteredMaterials([]); setFilteredForms([]); setFilteredGrades([]); }
    if (key === 'material') { setFilteredForms([]); setFilteredGrades([]); }
    if (key === 'form') { setFilteredGrades([]); }

    setManualMode(newManualMode);
    setFormData(newFormData);
  };

  // --- HANDLERS (Same as before) ---
  const handleScrapTypeChange = (e) => {
    const val = e.target.value;
    setFilteredCategories([]); setFilteredMaterials([]); setFilteredForms([]); setFilteredGrades([]);
    setFormData(prev => ({ ...prev, category: '', material: '', form: '', grade: '' }));

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, scrapType: true, category: true, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, scrapType: '' })); 
    } else {
        setFormData(prev => ({ ...prev, scrapType: val }));
        const categories = hierarchy.filter(item => item.scrap_type === val);
        setFilteredCategories(categories || []);
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setFilteredMaterials([]); setFilteredForms([]); setFilteredGrades([]);
    setFormData(prev => ({ ...prev, material: '', form: '', grade: '' }));

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, category: true, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, category: '' }));
    } else {
        const catId = parseInt(val);
        const catObj = hierarchy.find(item => item.id === catId);
        if (catObj) {
            setFormData(prev => ({ ...prev, category: catObj.material_category })); 
            setFilteredMaterials(catObj.materials || []);
        }
    }
  };

  const handleMaterialChange = (e) => {
    const val = e.target.value;
    setFilteredForms([]); setFilteredGrades([]);
    setFormData(prev => ({ ...prev, form: '', grade: '' }));

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, material: true, form: true, grade: true }));
        setFormData(prev => ({ ...prev, material: '' }));
    } else {
        const matId = parseInt(val);
        const matObj = filteredMaterials.find(item => item.id === matId);
        if (matObj) {
            setFormData(prev => ({ ...prev, material: matObj.material_name }));
            setFilteredForms(matObj.forms || []);
        }
    }
  };

  const handleFormChange = (e) => {
    const val = e.target.value;
    setFilteredGrades([]);
    setFormData(prev => ({ ...prev, grade: '' }));

    if (val === 'Others') {
        setManualMode(prev => ({ ...prev, form: true, grade: true }));
        setFormData(prev => ({ ...prev, form: '' }));
    } else {
        const fId = parseInt(val);
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
        const gradeObj = filteredGrades.find(item => item.id === gId);
        if (gradeObj) {
            setFormData(prev => ({ ...prev, grade: gradeObj.grade_name }));
        }
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Guest Validations
    if (!isAuthenticated) {
        if(!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.guestCompany || !formData.guestGst) {
            setError("All company details are mandatory.");
            setLoading(false);
            return;
        }
    }

    try {
      const payload = { ...formData };
      
      // 1. Get Token (if logged in)
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 2. REAL API CALL
      const response = await axios.post(
          'https://scrapcy-backend-new-1.onrender.com/requirements/create', 
          payload,
          { headers }
      );
      
      console.log("Requirement Posted:", response.data);
      setSuccess(true);
      
      setTimeout(() => {
        onClose(); // Triggers refresh in parent
        setFormData({
            scrapType: '', category: '', material: '', form: '', grade: '', locations: '', description: '', note: '',
            guestName: '', guestEmail: '', guestPhone: '', guestCompany: '', guestGst: ''
        });
        setManualMode({ scrapType: false, category: false, material: false, form: false, grade: false });
        setFilteredCategories([]); setFilteredMaterials([]); setFilteredForms([]); setFilteredGrades([]);
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Failed to post requirement. Server error.");
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
                
                {hierarchy.length === 0 && !dataLoading && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-xs font-bold rounded flex items-center gap-2">
                        <AlertCircle size={16}/> Warning: Unable to load categories. Please type manually using 'Others'.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* SCRAP TYPE */}
                  <div className="relative">
                    {manualMode.scrapType ? (
                        <div className="relative">
                            <input name="scrapType" value={formData.scrapType} onChange={handleInputChange} placeholder="Scrap Type (Manual)" className="w-full p-3 pr-10 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required autoFocus />
                            <button type="button" onClick={() => toggleToDropdown('scrapType')} className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-navy hover:bg-gray-100 rounded" title="Back to List"><List size={16}/></button>
                        </div>
                    ) : (
                        <select onChange={handleScrapTypeChange} value={formData.scrapType} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer" required disabled={dataLoading}>
                            <option value="">{dataLoading ? "Loading..." : "Select Scrap Type"}</option>
                            {[...new Set(hierarchy.map(item => item.scrap_type))].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others (Add New)</option>
                        </select>
                    )}
                  </div>

                  {/* CATEGORY */}
                  <div className="relative">
                    {manualMode.category ? (
                        <div className="relative">
                            <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category (Manual)" className="w-full p-3 pr-10 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                            <button type="button" onClick={() => toggleToDropdown('category')} className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-navy hover:bg-gray-100 rounded" title="Back to List"><List size={16}/></button>
                        </div>
                    ) : (
                        <select onChange={handleCategoryChange} value={filteredCategories.find(c => c.material_category === formData.category)?.id || ''} disabled={!formData.scrapType} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Category</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.material_category}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* MATERIAL */}
                  <div className="relative">
                    {manualMode.material ? (
                        <div className="relative">
                            <input name="material" value={formData.material} onChange={handleInputChange} placeholder="Material (Manual)" className="w-full p-3 pr-10 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                            <button type="button" onClick={() => toggleToDropdown('material')} className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-navy hover:bg-gray-100 rounded" title="Back to List"><List size={16}/></button>
                        </div>
                    ) : (
                        <select onChange={handleMaterialChange} value={filteredMaterials.find(m => m.material_name === formData.material)?.id || ''} disabled={!formData.category} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Material</option>
                            {filteredMaterials.map(mat => (
                                <option key={mat.id} value={mat.id}>{mat.material_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* FORM */}
                  <div className="relative">
                    {manualMode.form ? (
                        <div className="relative">
                            <input name="form" value={formData.form} onChange={handleInputChange} placeholder="Form (Manual)" className="w-full p-3 pr-10 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                            <button type="button" onClick={() => toggleToDropdown('form')} className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-navy hover:bg-gray-100 rounded" title="Back to List"><List size={16}/></button>
                        </div>
                    ) : (
                        <select onChange={handleFormChange} value={filteredForms.find(f => f.form_name === formData.form)?.id || ''} disabled={!formData.material} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100" required>
                            <option value="">Select Form</option>
                            {(filteredForms || []).map(form => (
                                <option key={form.id} value={form.id}>{form.form_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>

                  {/* GRADE */}
                  <div className="relative">
                    {manualMode.grade ? (
                        <div className="relative">
                            <input name="grade" value={formData.grade} onChange={handleInputChange} placeholder="Grade (Manual)" className="w-full p-3 pr-10 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" required />
                            <button type="button" onClick={() => toggleToDropdown('grade')} className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-navy hover:bg-gray-100 rounded" title="Back to List"><List size={16}/></button>
                        </div>
                    ) : (
                        <select onChange={handleGradeChange} value={filteredGrades.find(g => g.grade_name === formData.grade)?.id || ''} disabled={!formData.form || filteredGrades.length === 0} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none cursor-pointer disabled:bg-gray-100">
                            <option value="">Select Grade</option>
                            {(filteredGrades || []).map(grad => (
                                <option key={grad.id} value={grad.id}>{grad.grade_name}</option>
                            ))}
                            <option value="Others" className="font-bold text-orange">+ Others</option>
                        </select>
                    )}
                  </div>
                  
                  {/* LOCATION */}
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

              {/* SECTION 2: COMPANY DETAILS (Updated) */}
              {!isAuthenticated && (
                <div className="animate-fadeIn">
                  <h3 className="text-sm font-black text-navy uppercase border-b-2 border-platinum pb-2 mb-4 flex items-center gap-2">
                    <Building2 size={16} className="text-orange"/> Company Details
                  </h3>
                  <div className="bg-orange/5 border border-orange/20 p-4 rounded-lg mb-4">
                    <p className="text-xs text-orange font-bold uppercase tracking-wide">Please provide your contact info so sellers can reach you.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Row 1: Company & GST */}
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestCompany" value={formData.guestCompany} onChange={handleInputChange} placeholder="Company Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <FileText size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestGst" value={formData.guestGst} onChange={handleInputChange} placeholder="GST Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>

                    {/* Row 2: Phone */}
                    <div className="relative md:col-span-2">
                        <Phone size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestPhone" value={formData.guestPhone} onChange={handleInputChange} placeholder="Phone Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>

                    {/* Row 3: Name & Email */}
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestName" value={formData.guestName} onChange={handleInputChange} placeholder="Full Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestEmail" value={formData.guestEmail} onChange={handleInputChange} placeholder="Email Address" type="email" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>

                  </div>
                </div>
              )}

              {error && <div className="text-red-500 text-sm font-bold text-center">{error}</div>}

              {/* Updated Button Text */}
              <button type="submit" disabled={loading} className="w-full py-4 bg-navy text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Submitting..." : "Submit"}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostRequirementModal;
