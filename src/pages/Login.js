import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 shadow-2xl border-b-8 border-navy">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-platinum rounded-full mb-4">
            <Lock className="text-orange" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Welcome Back</h2>
          <p className="text-steel font-bold text-sm uppercase tracking-widest mt-2">Secure Portal Access</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 text-steel">Email Address</label>
            <input type="email" className="w-full p-4 bg-platinum/20 border-2 border-platinum focus:border-orange outline-none transition" placeholder="name@company.com" required />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 text-steel">Password</label>
            <input type="password" className="w-full p-4 bg-platinum/20 border-2 border-platinum focus:border-orange outline-none transition" placeholder="••••••••" required />
          </div>
          
          <button className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-orange transition-all">
            Enter Portal <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-platinum text-center">
          <p className="text-sm text-steel font-medium">
            Don't have an account? <Link to="/register" className="text-orange font-black hover:underline">REGISTER NOW</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
