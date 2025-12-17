import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter italic">
          SCRAP<span className="text-orange">CY</span>
        </Link>
        
        <div className="hidden md:flex space-x-8 font-bold uppercase text-xs tracking-widest">
          <Link href="/" className="hover:text-orange transition">Home</Link>
          <a href="#prices" className="hover:text-orange transition">Market Prices</a>
          <a href="#auction" className="hover:text-orange transition">E-Auction</a>
        </div>

        <div className="flex gap-4">
          <Link to="/login" className="text-xs font-bold border border-white px-4 py-2 hover:bg-white hover:text-navy transition">
            LOGIN
          </Link>
          <Link to="/register" className="text-xs font-bold bg-orange px-4 py-2 hover:bg-white hover:text-orange transition">
            REGISTER
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
