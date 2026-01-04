import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Mail, Key } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- SIMULATING BACKEND RESPONSE ---
    // In a real app, you send formData to API. 
    // The API returns the user object with a 'role' or 'privileges'.
    setTimeout(() => {
      setIsLoading(false);

      // DEMO LOGIC: 
      // If email contains 'admin', treat as Company. Otherwise, Bidder.
      if (formData.email.includes('admin')) {
        console.log("Backend identified user as: COMPANY");
        navigate('/company/dashboard');
      } else {
        console.log("Backend identified user as: BIDDER");
        navigate('/'); 
      }
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-platinum">
      <div className="max-w-md w-full bg-white shadow-2xl overflow-hidden rounded-lg">
        
        {/* HEADER SECTION */}
        <div className="bg-navy p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange"></div>
          
          {/* Decorative Circle */}
          <div className="inline-block p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm border border-white/10 shadow-inner">
            <Lock className="text-orange" size={32} />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter">Welcome Back</h2>
          <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mt-2">
            Secure Industrial Portal
          </p>
        </div>

        {/* LOGIN FORM */}
        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div className="relative">
              <label className="block text-[10px] font-black uppercase mb-2 text-steel ml-1">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-steel" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 bg-platinum/20 border-2 border-platinum focus:border-navy outline-none transition font-bold text-navy rounded" 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[10px] font-black uppercase text-steel">Password</label>
                <a href="#" className="text-[10px] font-bold text-orange hover:text-navy transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-4 text-steel" size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 p-4 bg-platinum/20 border-2 border-platinum focus:border-navy outline-none transition font-bold text-navy rounded" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-orange hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed rounded"
            >
              {isLoading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>Access Portal <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* FOOTER LINKS */}
          <div className="mt-8 pt-6 border-t border-platinum text-center space-y-3">
            <p className="text-xs text-steel font-medium">
              Don't have an account? <Link to="/register" className="text-navy font-black hover:text-orange transition uppercase ml-1">Register Now</Link>
            </p>
            <p className="text-[10px] text-platinum-dark/60">
              Protected by reCAPTCHA and subject to the Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
