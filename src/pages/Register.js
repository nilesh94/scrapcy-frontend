import React, { useState } from 'react';

const Register = () => {
  const [role, setRole] = useState('bidder'); // default role

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white shadow-2xl border-t-4 border-orange">
      <h2 className="text-3xl font-black uppercase mb-6">Create Account</h2>
      
      {/* Role Switcher */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setRole('bidder')}
          className={`flex-1 py-2 font-bold text-xs border ${role === 'bidder' ? 'bg-navy text-white' : 'border-platinum'}`}
        >
          INDIVIDUAL BIDDER
        </button>
        <button 
          onClick={() => setRole('company')}
          className={`flex-1 py-2 font-bold text-xs border ${role === 'company' ? 'bg-navy text-white' : 'border-platinum'}`}
        >
          COMPANY OWNER
        </button>
      </div>

      <form className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-3 border border-platinum outline-orange" required />
        <input type="email" placeholder="Email Address" className="w-full p-3 border border-platinum outline-orange" required />
        <input type="tel" placeholder="Phone Number" className="w-full p-3 border border-platinum outline-orange" required />

        {/* Conditional Fields for Company */}
        {role === 'company' && (
          <div className="space-y-4 pt-4 border-t border-platinum">
            <p className="text-[10px] font-black text-orange uppercase tracking-widest">Business Details (Mandatory)</p>
            <input type="text" placeholder="Company Name" className="w-full p-3 border border-platinum outline-orange" required />
            <input type="text" placeholder="GST Registration Number" className="w-full p-3 border border-platinum outline-orange" required />
            <input type="text" placeholder="Annual Turnover" className="w-full p-3 border border-platinum outline-orange" required />
          </div>
        )}

        <button className="w-full bg-orange text-white py-4 font-black uppercase hover:bg-navy transition-colors">
          Create {role === 'company' ? 'Corporate' : 'Individual'} Account
        </button>
      </form>
    </div>
  );
};

export default Register;
