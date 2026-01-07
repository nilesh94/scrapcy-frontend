import React, { useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Upload, Save, CheckCircle, XCircle, FileText, Users 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    scrapType: 'Ferrous',
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    quantity: '',
    pricePerKg: '',
    addedBy: 'admin'
  });

  const [selectedFiles, setSelectedFiles] = useState(null);

  // Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Create FormData object for multipart/form-data
      const data = new FormData();
      data.append('scrap_type', formData.scrapType);
      data.append('company_name', formData.companyName);
      data.append('gst_number', formData.gstNumber);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('quantity', formData.quantity);
      data.append('price_per_kg', formData.pricePerKg);
      data.append('added_by', 'admin');

      // Append Files
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          data.append('files', selectedFiles[i]);
        }
      }

      // API Call
      const response = await axios.post(
        'https://scrapcy-backend-new-1.onrender.com/listings/create', // Update with your actual URL
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccessMsg(`Success! Listing ID: ${response.data.listing_id} created.`);
      
      // Reset Form
      setFormData({
        scrapType: 'Ferrous', companyName: '', gstNumber: '', email: '', phone: '', quantity: '', pricePerKg: '', addedBy: 'admin'
      });
      setSelectedFiles(null);

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to create listing. Please check inputs.');
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
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                        </div>
                    </div>
                </div>

                {/* Section 2: Scrap Details */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <LayoutDashboard size={16} /> Material Info
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
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
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Quantity (Tons)</label>
                            <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" step="0.01" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-navy mb-1">Price (Per Kg)</label>
                            <input name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} type="number" step="0.01" className="w-full p-3 bg-white border border-platinum rounded focus:border-orange outline-none" required />
                        </div>
                    </div>
                </div>

                {/* Section 3: Images */}
                <div className="bg-platinum/20 p-6 rounded-lg border border-platinum">
                    <h3 className="text-sm font-black text-steel uppercase mb-4 flex items-center gap-2">
                        <Upload size={16} /> Upload Images
                    </h3>
                    <div className="border-2 border-dashed border-steel/30 bg-white rounded-lg p-8 text-center">
                        <input 
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
                        <p className="text-xs text-steel mt-2">Supports JPG, PNG (Max 5MB)</p>
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
