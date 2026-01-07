import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building2, Briefcase, FileText, MapPin, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, XCircle, Info 
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  // Default role is bidder
  const [role, setRole] = useState('bidder');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // State for Form Data
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', 
    password: '', confirmPassword: '',
    companyName: '', businessType: '', industry: '', turnover: '',
    gstNumber: '', panNumber: '',
    address: '', city: '', state: '', pincode: ''
  });

  // State for Validation
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false, upper: false, lower: false, number: false, special: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // --- VALIDATION LOGIC ---
  useEffect(() => {
    const { password, confirmPassword } = formData;

    // 1. Password Strength
    const criteria = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordCriteria(criteria);

    // 2. Passwords Match
    const match = password && password === confirmPassword;
    setPasswordsMatch(match);

    const isStrong = Object.values(criteria).every(Boolean);
    
    // 3. Required Fields Logic
    const basicFields = formData.firstName && formData.lastName && formData.email && formData.phone;
    
    // Seller Logic: Needs Company Details
    // Bidder Logic: Only needs Basic Details
    let companyFields = true; // Default to true (valid) for Bidders

    if (role === 'seller') {
       // If Seller, strict check on these fields
       companyFields = formData.companyName && 
                       formData.businessType && 
                       formData.gstNumber && 
                       formData.address && 
                       formData.city && 
                       formData.state && 
                       formData.pincode;
    }

    setIsFormValid(isStrong && match && basicFields && companyFields);

  }, [formData, role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setApiError('');

    // 1. Prepare Data
    // Mapping: 'bidder' -> 'user' (standard role), 'seller' -> 'seller'
    const finalRole = role === 'bidder' ? 'user' : 'seller';

    // 2. Construct Payload
    // CRITICAL: If role is 'user' (bidder), we explicitly send null for company fields
    // This prevents accidental data submission if they switched tabs
    const isSeller = finalRole === 'seller';

    const apiPayload = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      role: finalRole, 
      
      // Conditional Fields: Send data ONLY if seller, otherwise null
      company_name: isSeller ? (formData.companyName || null) : null,
      business_type: isSeller ? (formData.businessType || null) : null,
      industry: isSeller ? (formData.industry || null) : null,
      turnover: isSeller ? (formData.turnover || null) : null,
      gst_number: isSeller ? (formData.gstNumber || null) : null,
      pan_number: isSeller ? (formData.panNumber || null) : null,
      address: isSeller ? (formData.address || null) : null,
      city: isSeller ? (formData.city || null) : null,
      state: isSeller ? (formData.state || null) : null,
      pincode: isSeller ? (formData.pincode || null) : null
    };

    try {
      // 3. Send Request
      const response = await axios.post(
        'https://scrapcy-backend-new-1.onrender.com/users/register',
        apiPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Registration Success:", response.data);
      alert(`Registration Successful! You are registered as a ${role.toUpperCase()}.`);
      navigate('/login'); 

    } catch (err) {
      console.error("Registration Error:", err);
      // Handle Render 500 errors or Flask 400 errors
      const msg = err.response?.data?.error || err.response?.data?.detail || "Registration failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-lg overflow-hidden border-t-8 border-orange">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-navy text-white text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Create Account</h2>
          <p className="text-orange text-xs font-bold tracking-widest mt-2 uppercase">
            Join the Industrial Scrap Network
          </p>
        </div>

        <div className="p-8">
          
          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-2">
              <XCircle size={18} />
              {apiError}
            </div>
          )}

          {/* --- ROLE SWITCHER (2 TYPES) --- */}
          <div className="flex gap-4 mb-6 p-1.5 bg-platinum rounded-lg">
            {/* Bidder Button */}
            <button 
              type="button"
              onClick={() => setRole('bidder')}
              className={`flex-1 py-4 font-black text-xs uppercase tracking-widest rounded transition-all duration-300 ${role === 'bidder' ? 'bg-white text-navy shadow-md transform scale-[1.02]' : 'text-steel hover:text-navy'}`}
            >
              <User size={16} className="inline mb-1 mr-2"/> Individual Bidder
            </button>

            {/* Seller Button */}
            <button 
              type="button"
              onClick={() => setRole('seller')}
              className={`flex-1 py-4 font-black text-xs uppercase tracking-widest rounded transition-all duration-300 ${role === 'seller' ? 'bg-white text-navy shadow-md transform scale-[1.02]' : 'text-steel hover:text-navy'}`}
            >
              <Building2 size={16} className="inline mb-1 mr-2"/> Company Seller
            </button>
          </div>

          {/* Dynamic Role Description */}
          <div className={`mb-8 p-4 rounded border-l-4 text-xs font-medium flex items-start gap-3 
            ${role === 'bidder' ? 'bg-blue-50 border-navy text-navy' : 'bg-orange/10 border-orange text-orange-900'}`}>
              
              <Info size={18} className="shrink-0 mt-0.5" />
              
              {role === 'bidder' && (
                <div>
                  <strong className="block mb-1 text-sm">Individual Bidder</strong>
                  You can browse live auctions, place bids on scrap materials, and track your purchase history. You <u>cannot</u> post new auctions.
                </div>
              )}
              {role === 'seller' && (
                <div>
                  <strong className="block mb-1 text-sm">Company Seller</strong>
                  You can list scrap materials for auction, manage inventory, and sell to the highest bidder. Requires business details (GST/PAN).
                </div>
              )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION 1: ACCOUNT CREDENTIALS (ALL ROLES) --- */}
            <div className="space-y-4">
               <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                 <Lock size={16} className="text-orange"/> Account Details
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Official Email Address" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Mobile Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                  </div>
               </div>

               {/* Password Fields */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Create Password" className="w-full pl-10 pr-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-steel hover:text-navy">
                      {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className={`w-full pl-10 pr-10 p-3 bg-platinum/30 border rounded text-sm focus:border-navy outline-none ${formData.confirmPassword && !passwordsMatch ? 'border-red-500 bg-red-50' : 'border-platinum'}`} required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-steel hover:text-navy">
                      {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                 </div>
               </div>

               {/* Password Requirements Checklist */}
               <div className="bg-platinum/20 p-3 rounded text-xs text-steel space-y-1">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-green-600 font-bold' : ''}`}> {passwordCriteria.length ? <CheckCircle size={10} /> : <XCircle size={10} />} 8+ Characters </span>
                    <span className={`flex items-center gap-1 ${passwordCriteria.upper ? 'text-green-600 font-bold' : ''}`}> {passwordCriteria.upper ? <CheckCircle size={10} /> : <XCircle size={10} />} 1 Uppercase </span>
                    <span className={`flex items-center gap-1 ${passwordCriteria.lower ? 'text-green-600 font-bold' : ''}`}> {passwordCriteria.lower ? <CheckCircle size={10} /> : <XCircle size={10} />} 1 Lowercase </span>
                    <span className={`flex items-center gap-1 ${passwordCriteria.number ? 'text-green-600 font-bold' : ''}`}> {passwordCriteria.number ? <CheckCircle size={10} /> : <XCircle size={10} />} 1 Number </span>
                    <span className={`flex items-center gap-1 ${passwordsMatch && formData.confirmPassword ? 'text-green-600 font-bold' : (formData.confirmPassword ? 'text-red-500 font-bold' : '')}`}> {passwordsMatch && formData.confirmPassword ? <CheckCircle size={10} /> : <XCircle size={10} />} Passwords Match </span>
                  </div>
               </div>
            </div>

            {/* --- SECTION 2: COMPANY DETAILS (ONLY FOR SELLER) --- */}
            {role === 'seller' && (
              <div className="animate-fadeIn space-y-6 pt-4">
                  <div>
                    <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-orange"/> Organization Details
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 text-steel" size={18} />
                        <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Registered Company Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm text-steel focus:border-navy outline-none cursor-pointer" required>
                          <option value="">Select Business Type</option>
                          <option value="Proprietorship">Proprietorship</option>
                          <option value="Partnership">Partnership</option>
                          <option value="LLP">LLP</option>
                          <option value="Private Limited">Private Limited</option>
                          <option value="Public Limited">Public Limited</option>
                        </select>
                        <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm text-steel focus:border-navy outline-none cursor-pointer">
                          <option value="">Select Industry</option>
                          <option value="Ferrous Metal">Ferrous Metal</option>
                          <option value="Non-Ferrous">Non-Ferrous</option>
                          <option value="E-Waste">E-Waste</option>
                          <option value="Plastic">Plastic</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-orange"/> Statutory & Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} type="text" placeholder="GST Number (15 Digits)" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none uppercase" required />
                        <input name="panNumber" value={formData.panNumber} onChange={handleChange} type="text" placeholder="PAN Number" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none uppercase" required />
                    </div>
                    <div className="space-y-4">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 text-steel" size={18} />
                          <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Registered Office Address" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                          <input name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                          <input name="pincode" value={formData.pincode} onChange={handleChange} type="text" placeholder="Pincode" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                        </div>
                    </div>
                  </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-4 font-black uppercase text-sm tracking-widest rounded shadow-lg transition-all duration-300
                  ${!isFormValid || loading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-dashed border-gray-400 opacity-70'
                    : 'bg-navy text-white hover:bg-orange hover:shadow-xl cursor-pointer' 
                  }`}
              >
                {loading ? 'Processing...' : `Register as ${role === 'seller' ? 'Seller' : 'Bidder'}`}
              </button>
              
              {!isFormValid && (
                 <p className="text-center text-xs text-red-500 font-bold mt-2 animate-pulse">
                   * Please complete all required fields
                 </p>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
