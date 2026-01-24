import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, User, Building2, Mail, Phone, FileText } from 'lucide-react';

const PostRequirementModal = ({ isOpen, onClose, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // validation for guest
    if (!isAuthenticated) {
        if(!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.guestCompany || !formData.guestGst) {
            setError("All guest details are mandatory.");
            setLoading(false);
            return;
        }
    }

    try {
      const payload = {
        ...formData,
        // If logged in, we assume the backend extracts user_id from the token
        // If not logged in, the guest fields are sent
      };

      // Replace with your actual endpoint
      // const response = await axios.post('https://scrapcy-backend-new-1.onrender.com/requirements/create', payload);
      
      // SIMULATING API CALL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Requirement Posted:", payload);
      setSuccess(true);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
        setFormData({
            scrapType: '', category: '', material: '', form: '', grade: '', locations: '', description: '', note: '',
            guestName: '', guestEmail: '', guestPhone: '', guestCompany: '', guestGst: ''
        });
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="scrapType" value={formData.scrapType} onChange={handleChange} placeholder="Scrap Type (e.g. Ferrous)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none font-bold text-navy" required />
                  <input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g. HMS)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  <input name="material" value={formData.material} onChange={handleChange} placeholder="Material (e.g. Iron)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  <input name="form" value={formData.form} onChange={handleChange} placeholder="Form (e.g. Bundle)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  <input name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade (e.g. 1 & 2)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  <input name="locations" value={formData.locations} onChange={handleChange} placeholder="Preferred Locations (Comma separated)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed Description (Qty, Specs, etc.)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none h-24 resize-none" required />
                    <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Note to Seller (Optional)" className="p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none h-24 resize-none" />
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
                        <input name="guestName" value={formData.guestName} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestEmail" value={formData.guestEmail} onChange={handleChange} placeholder="Email Address" type="email" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestPhone" value={formData.guestPhone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestCompany" value={formData.guestCompany} onChange={handleChange} placeholder="Company Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    </div>
                    <div className="relative md:col-span-2">
                        <FileText size={16} className="absolute left-3 top-3.5 text-steel"/>
                        <input name="guestGst" value={formData.guestGst} onChange={handleChange} placeholder="GST Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
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
