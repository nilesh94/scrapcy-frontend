import React, { useState } from 'react';
import { 
  User, Building2, Briefcase, FileText, MapPin, Mail, Phone, Lock, Eye, EyeOff 
} from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('bidder');
  const [showPassword, setShowPassword] = useState(false);

  // Initial State for Form Data
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    companyName: '', businessType: '', industry: '', turnover: '',
    gstNumber: '', panNumber: '',
    address: '', city: '', state: '', pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering as:", role, formData);
    // Add API call logic here
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
          {/* Role Switcher */}
          <div className="flex gap-4 mb-8 p-1.5 bg-platinum rounded-lg">
            <button 
              onClick={() => setRole('bidder')}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded transition-all duration-300 ${role === 'bidder' ? 'bg-white text-navy shadow-md transform scale-[1.02]' : 'text-steel hover:text-navy'}`}
            >
              <User size={16} className="inline mb-1 mr-2"/> Individual Bidder
            </button>
            <button 
              onClick={() => setRole('company')}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded transition-all duration-300 ${role === 'company' ? 'bg-white text-navy shadow-md transform scale-[1.02]' : 'text-steel hover:text-navy'}`}
            >
              <Building2 size={16} className="inline mb-1 mr-2"/> Company Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION 1: LOGIN CREDENTIALS (COMMON) --- */}
            <div className="space-y-4">
               <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                 <Lock size={16} className="text-orange"/> Account Credentials
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" required />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" required />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="email" onChange={handleChange} type="email" placeholder="Official Email Address" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-steel" size={18} />
                    <input name="phone" onChange={handleChange} type="tel" placeholder="Mobile Number" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" required />
                  </div>
               </div>

               <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-steel" size={18} />
                  <input 
                    name="password" 
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create Password" 
                    className="w-full pl-10 pr-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-steel hover:text-navy">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
               </div>
            </div>

            {/* --- SECTION 2: COMPANY DETAILS (ONLY FOR COMPANY) --- */}
            {role === 'company' && (
              <div className="animate-fadeIn space-y-6 pt-4">
                 
                 {/* Organization Info */}
                 <div>
                    <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-orange"/> Organization Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 text-steel" size={18} />
                        <input name="companyName" onChange={handleChange} type="text" placeholder="Registered Company Name" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none transition" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="businessType" onChange={handleChange} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm text-steel focus:border-navy outline-none cursor-pointer">
                          <option value="">Select Business Type</option>
                          <option value="Proprietorship">Proprietorship</option>
                          <option value="Partnership">Partnership</option>
                          <option value="LLP">LLP</option>
                          <option value="Private Limited">Private Limited</option>
                          <option value="Public Limited">Public Limited</option>
                        </select>

                        <select name="industry" onChange={handleChange} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm text-steel focus:border-navy outline-none cursor-pointer">
                          <option value="">Select Industry Category</option>
                          <option value="Ferrous Metal">Ferrous Metal (Iron/Steel)</option>
                          <option value="Non-Ferrous">Non-Ferrous (Copper/Alu)</option>
                          <option value="E-Waste">E-Waste Recycling</option>
                          <option value="Plastic">Plastic Scrap</option>
                          <option value="General Scrap">General Scrap Trader</option>
                        </select>
                      </div>

                      <select name="turnover" onChange={handleChange} className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm text-steel focus:border-navy outline-none cursor-pointer">
                        <option value="">Select Annual Turnover</option>
                        <option value="0-1Cr">Under ₹1 Crore</option>
                        <option value="1Cr-10Cr">₹1 Cr - ₹10 Cr</option>
                        <option value="10Cr-50Cr">₹10 Cr - ₹50 Cr</option>
                        <option value="50Cr+">Above ₹50 Crore</option>
                      </select>
                    </div>
                 </div>

                 {/* Statutory Info */}
                 <div>
                    <h3 className="text-navy font-bold text-sm uppercase border-b border-platinum pb-2 mb-4 flex items-center gap-2">
                      <FileText size={16} className="text-orange"/> Statutory & Address
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <input name="gstNumber" onChange={handleChange} type="text" placeholder="GST Number (15 Digits)" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none uppercase" required />
                       <input name="panNumber" onChange={handleChange} type="text" placeholder="Company PAN Number" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none uppercase" required />
                    </div>

                    <div className="space-y-4">
                       <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 text-steel" size={18} />
                          <input name="address" onChange={handleChange} type="text" placeholder="Registered Office Address" className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4">
                          <input name="city" onChange={handleChange} type="text" placeholder="City" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                          <input name="state" onChange={handleChange} type="text" placeholder="State" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                          <input name="pincode" onChange={handleChange} type="text" placeholder="Pincode" className="w-full p-3 bg-platinum/30 border border-platinum rounded text-sm focus:border-navy outline-none" required />
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest hover:bg-orange transition-all duration-300 shadow-lg rounded">
                Register as {role === 'company' ? 'Company' : 'Bidder'}
              </button>
              <p className="text-center text-xs text-steel mt-4 font-medium">
                By clicking Register, you agree to our <span className="text-navy cursor-pointer hover:underline">Terms of Trade</span> & <span className="text-navy cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
