import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, XCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://scrapcy-backend-new-1.onrender.com/users/login',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Login Success:", response.data);

      // 1. Store Token & User Data
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 2. Redirect based on Role
      // Backend returns role as 'seller' or 'user' (user = bidder)
      const userRole = response.data.user.role;
      
      if (userRole === 'seller') {
        navigate('/company-dashboard');
      } else {
        navigate('/bidder-dashboard');
      }

    } catch (err) {
      console.error("Login Error:", err);
      // Handle 403 (Invalid Creds) or 500 (Server Error)
      const msg = err.response?.data?.detail || "Login failed. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-lg overflow-hidden border-t-8 border-navy">
        
        {/* Header */}
        <div className="bg-navy p-8 text-center text-white">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Welcome Back</h2>
          <p className="text-orange text-xs font-bold tracking-widest mt-2 uppercase">
            Log in to manage your auctions
          </p>
        </div>

        <div className="p-8">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-2 animate-fadeIn">
              <XCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-steel">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-steel group-focus-within:text-navy transition-colors" size={18} />
                <input 
                  name="email" 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com" 
                  className="w-full pl-10 p-3 bg-platinum/30 border border-platinum rounded text-sm font-medium focus:border-navy focus:bg-white outline-none transition-all" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-steel">Password</label>
                <a href="#" className="text-[10px] font-bold text-orange hover:text-navy uppercase tracking-wide">Forgot Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-steel group-focus-within:text-navy transition-colors" size={18} />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password" 
                  className="w-full pl-10 pr-10 p-3 bg-platinum/30 border border-platinum rounded text-sm font-medium focus:border-navy focus:bg-white outline-none transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-3.5 text-steel hover:text-navy"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 font-black uppercase text-sm tracking-widest rounded shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                ${loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-orange text-white hover:bg-navy hover:shadow-xl'
                }`}
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  Log In <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="mt-8 text-center border-t border-platinum pt-6">
            <p className="text-xs font-medium text-gray-500 mb-2">Don't have an account?</p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-1 text-sm font-black text-navy hover:text-orange transition-colors uppercase tracking-wide"
            >
              Register Now <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
