import React, { useState } from 'react';

const Register = () => {
  const [role, setRole] = useState('bidder');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 shadow-2xl border-t-8 border-orange">
        <h2 className="text-3xl font-black uppercase mb-2">Join Scrapcy</h2>
        <p className="text-steel text-sm mb-8 font-bold">Select your account type to continue</p>
        
        <div className="flex gap-2 mb-8 p-1 bg-platinum rounded">
          <button 
            onClick={() => setRole('bidder')}
            className={`flex-1 py-2 font-black text-[10px] uppercase tracking-widest transition ${role === 'bidder' ? 'bg-navy text-white' : 'text-steel hover:text-navy'}`}
          >
            Individual Bidder
          </button>
          <button 
            onClick={() => setRole('company')}
            className={`flex-1 py-2 font-black text-[10px] uppercase tracking-widest transition ${role === 'company' ? 'bg-navy text-white' : 'text-steel hover:text-navy'}`}
          >
            Company Owner
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />
            <input type="text" placeholder="Last Name" className="p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />
          </div>
          <input type="email" placeholder="Email Address" className="w-full p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />
          <input type="tel" placeholder="Phone Number" className="w-full p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />

          {role === 'company' && (
            <div className="pt-4 border-t border-platinum space-y-4 animate-fadeIn">
              <input type="text" placeholder="Company Name" className="w-full p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />
              <input type="text" placeholder="GST Number (15 Digits)" className="w-full p-3 bg-platinum/30 border border-platinum outline-orange text-sm" required />
              <select className="w-full p-3 bg-platinum/30 border border-platinum outline-orange text-sm text-steel">
                <option>Select Annual Turnover</option>
                <option>Under 1 Cr</option>
                <option>1 Cr - 10 Cr</option>
                <option>Above 10 Cr</option>
              </select>
            </div>
          )}

          <button className="w-full bg-navy text-white py-4 font-black uppercase text-sm tracking-widest hover:bg-orange transition-all mt-6">
            Register as {role === 'company' ? 'Company' : 'Bidder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
