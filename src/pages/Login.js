import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Building2, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('company'); // Default role selection
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call delay
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/'); // Redirect bidders to Home for now
      }
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-platinum">
      <div className="max-w-md w-full bg-white shadow-2xl overflow-hidden rounded-lg">
        
        {/* HEADER SECTION */}
        <div className="bg-navy p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange"></div>
          <div className="inline-block p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
            <Lock className="text-orange" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Welcome Back</h2>
          <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mt-2">Secure Trading Portal</p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="flex border-b border-platinum">
          <button 
            onClick={() => setRole('company')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${role === 'company' ? 'bg-white text-navy border-b-4 border-orange' : 'bg-platinum/30 text-steel hover:bg-platinum'}`}
          >
            <Building2 size={16} className={role === 'company' ? 'text-orange' : 'text-steel'}/> Company
          </button>
          <button 
            onClick={() => setRole('bidder')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${role === 'bidder' ? 'bg-white text-navy border-b-4 border-orange' : 'bg-platinum/30 text-steel hover:bg-platinum'}`}
          >
            <User size={16} className={role === 'bidder' ? 'text-orange' : 'text-steel'}/> Bidder
          </button>
        </div>

        {/* LOGIN FORM */}
        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase mb-2 text-steel">
                {role === 'company' ? 'Corporate Email ID' : 'Registered Email'}
              </label>
              <input 
                type="email" 
                className="w-full p-4 bg-platinum/20 border-2 border-platinum focus:border-orange outline-none transition font-bold text-navy" 
                placeholder={role === 'company' ? "admin@metalworks.com" : "trader@gmail.com"} 
                required 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase text-steel">Password</label>
                <a href="#" className="text-[10px] font-bold text-orange hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                className="w-full p-4 bg-platinum/20 border-2 border-platinum focus:border-orange outline-none transition font-bold text-navy" 
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-orange transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Verifying Credentials...</span>
              ) : (
                <>Enter Portal <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* FOOTER LINKS */}
          <div className="mt-8 pt-6 border-t border-platinum text-center space-y-2">
            <p className="text-xs text-steel font-medium">
              New to Scrapcy? <Link to="/register" className="text-navy font-black hover:text-orange transition">CREATE ACCOUNT</Link>
            </p>
            <p className="text-[10px] text-platinum-dark">
              By logging in, you agree to our <a href="#" className="underline">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
