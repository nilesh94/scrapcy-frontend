import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, Building2, Mail, Phone, FileText, ChevronDown } from 'lucide-react';

const PostRequirementModal = ({ isOpen, onClose, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // --- 1. DYNAMIC DROPDOWN OPTIONS ---
  const [options, setOptions] = useState({
    scrapType: [],
    category: [],
    material: [],
    form: [],
    grade: []
  });

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
  // Tracks which fields have been switched to "Manual Text Input" (Others)
  const [manualMode, setManualMode] = useState({
    scrapType: false,
    category: false,
    material: false,
    form: false,
    grade: false
  });

  // Hierarchy Order: If one becomes manual, all below it must become manual
  const hierarchy = ['scrapType', 'category', 'material', 'form', 'grade'];

  // --- FETCH DROPDOWN DATA ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
      fetchDropdownOptions();
    }
  }, [isOpen]);

  const fetchDropdownOptions = async () => {
    setDataLoading(true);
    try {
        // Fetch existing listings to populate dropdowns dynamically from DB
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/scrap/all');
        const data = response.data;

        // Extract Unique Values using Set
        const uniqueOptions = {
            scrapType: [...new Set(data.map(item => item.scrap_type || item.category_ref?.scrap_type).filter(Boolean))],
            category: [...new Set(data.map(item => item.category || item.category_ref?.material_category).filter(Boolean))],
            material: [...new Set(data.map(item => item.material_name || item.material_ref?.material_name).filter(Boolean))],
            form: [...new Set(data.map(item => item.form || item.form_ref?.form_name).filter(Boolean))],
            grade: [...new Set(data.map(item => item.grade || item.grade_ref?.grade_name).filter(Boolean))]
        };

        setOptions(uniqueOptions);
    } catch (err) {
        console.error("Failed to load dropdown options:", err);
        // Fallback or leave empty (user can use 'Others')
    } finally {
        setDataLoading(false);
    }
  };

  // --- HANDLE INPUT CHANGE ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLE DROPDOWN SELECTION WITH "OTHERS" LOGIC ---
  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (value === 'Others') {
        // 1. Enable Manual Mode for this field
        // 2. AND Enable Manual Mode for ALL subsequent fields in hierarchy
        const startIndex = hierarchy.indexOf(name);
        const newManualMode = { ...manualMode };
        
        // Cascade the "Manual Mode" down the chain
        for (let i = startIndex; i < hierarchy.length; i++) {
            newManualMode[hierarchy[i]] = true;
            // Optional: Clear downstream values to force user entry
            // setFormData(prev => ({...prev, [hierarchy[i]]: ''})) 
        }
        
        setManualMode(newManualMode);
        
        // Clear current field value to allow typing
        setFormData(prev => ({ ...prev, [name]: '' }));
    } else {
        // Standard Selection
        setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        // Reset Form
        setFormData({
            scrapType: '', category: '', material: '', form: '', grade: '', locations: '', description: '', note: '',
            guestName: '', guestEmail: '', guestPhone: '', guestCompany: '', guestGst: ''
        });
        // Reset Manual Mode
        setManualMode({ scrapType: false, category: false, material: false, form: false, grade: false });
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Failed to post requirement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // --- HELPER TO RENDER FIELD (Select vs Input) ---
  const renderField = (key, label, placeholder) => {
    const isManual = manualMode[key];
    const dropdownOptions = options[key] || [];

    return (
        <div className="relative">
            {isManual ? (
                <input 
                    name={key} 
                    value={formData[key]} 
                    onChange={handleInputChange} 
                    placeholder={`Enter ${label} (Manual)`} 
                    className="w-full p-3 bg-white border-2 border-orange/50 rounded text-sm focus:border-orange outline-none font-medium animate-fadeIn" 
                    required 
                    autoFocus={formData[key] === ''} // Focus when switched
                />
            ) : (
                <div className="relative">
                    <select 
                        name={key} 
                        value={formData[key]} 
                        onChange={handleSelectChange} 
                        className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none appearance-none cursor-pointer" 
                        required
                        disabled={dataLoading}
                    >
                        <option value="">{dataLoading ? "Loading..." : `Select ${label}`}</option>
                        {dropdownOptions.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                        ))}
                        <option value="Others" className="font-bold text-orange bg-orange/10">+ Others (Add New)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
            )}
        </div>
    );
  };

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
                
                {/* Dynamic Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('scrapType', 'Scrap Type')}
                  {renderField('category', 'Category')}
                  {renderField('material', 'Material')}
                  {renderField('form', 'Form')}
                  {renderField('grade', 'Grade')}
                  
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
