import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, Users, MapPin 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    sellerName: 'Admin Entry',
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    alternatePhone: '',
    
    scrapType: 'Ferrous',
    grade: '',
    description: '',
    quantity: '',
    quantityUnit: 'Tons',
    pricePerUnit: '',
    priceUnit: 'Per Ton',
    
    address: '',
    pickupConditions: '',
    
    addedBy: 'admin'
  });

  const [selectedFiles, setSelectedFiles] = useState(null);

  // --- VALIDATION LOGIC FOR UNITS ---
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

  // Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errorMsg) setErrorMsg(''); // Clear error on type
  };

  // --- VALIDATION: IMAGE LIMITS ---
  const handleFileChange = (e) => {
    const files = e.target.files;
    
    if (files.length > 5) {
        setErrorMsg("Maximum 5 images allowed. Please select fewer files.");
        e.target.value = null; // Clear input
        setSelectedFiles(null);
        return;
    }
    
    setSelectedFiles(files);
    setErrorMsg('');
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    // --- VALIDATION: MANDATORY 1 IMAGE ---
    if (!selectedFiles || selectedFiles.length === 0) {
        setErrorMsg("At least 1 image is mandatory.");
        setLoading(false);
        return;
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

      // Scrap
      data.append('scrap_type', formData.scrapType);
      if(formData.grade) data.append('grade', formData.grade);
      if(formData.description) data.append('description', formData.description);
      
      data.append('quantity', formData.quantity);
      data.append('unit', formData.quantityUnit);
      data.append('price_per_unit', formData.pricePerUnit);
      data.append('price_unit', formData.priceUnit);
      
      // Location
      data.append('address', formData.address);
      if(formData.pickupConditions) data.append('pickup_conditions', formData.pickupConditions);
      
      data.append('added_by', 'admin');

      // Append Images
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('images', selectedFiles[i]);
      }

      const response = await axios.post(
        'https://scrapcy-backend-new-1.onrender.com/scrap/add', 
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccessMsg(`Success! Listing ID: ${response.data.listing_id} created.`);
      
      // Reset Form
      setFormData({
        sellerName: 'Admin Entry', companyName: '', gstNumber: '', email: '', phone: '', alternatePhone: '',
        scrapType: 'Ferrous', grade: '', description: '', quantity: '', quantityUnit: 'Tons', 
        pricePerUnit: '', priceUnit: 'Per Ton', address: '', pickupConditions: '',
        addedBy: 'admin'
      });
      setSelectedFiles(null);
      // Reset file input manually
      document.getElementById('fileInput').value = ""; 

    } catch (err) {
      console.error(err);
      const serverError = err.response?.data?.detail || 'Failed to create listing.';
      setErrorMsg(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Admin Console</h1>
            <p className="text-orange text-sm font-bold uppercase tracking-widest">
                System Administrator • Manage Listings
            </p>
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        <div className="bg-white p-8 shadow-2xl rounded-lg border-t-8 border-orange">
            
            <h2 className="text-2xl font-black text-navy uppercase mb-6 flex items-center gap-2">
                <FileText className="text-orange" /> Add New Scrap Listing
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
                
                {/* Section 1: Seller Info */}
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

                {/* Section 2: Location Info */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <MapPin size={16} /> Location & Pickup
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Detailed Address (City, State, Pincode)</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="Full pickup address..." required></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Pickup Conditions / Access Notes</label>
                            <input name="pickupConditions" value={formData.pickupConditions} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="e.g. 24ft Truck entry available, Weighbridge on-site..." />
                        </div>
                    </div>
                </div>

                {/* Section 3: Scrap Details */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <LayoutDashboard size={16} /> Material Info
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Scrap Type</label>
                            <select name="scrapType" value={formData.scrapType} onChange={handleChange} className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none cursor-pointer">
                                <option value="Ferrous">Ferrous</option>
                                <option value="Non-Ferrous">Non-Ferrous</option>
                                <option value="E-Waste">E-Waste</option>
                                <option value="Plastic">Plastic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Grade / Quality</label>
                            <input name="grade" value={formData.grade} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="e.g. HMS 1&2, Grade A..." />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-xs font-bold uppercase text-navy mb-1">Material Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" placeholder="Detailed description of the scrap condition, attachments, etc."></textarea>
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

                {/* Section 4: Images */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <Upload size={16} /> Upload Images (Max 5)
                    </h3>
                    <div className="border-2 border-dashed border-steel/30 bg-white rounded-lg p-8 text-center">
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
                            file:bg-orange/10 file:text-orange
                            hover:file:bg-orange/20 cursor-pointer"
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
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
