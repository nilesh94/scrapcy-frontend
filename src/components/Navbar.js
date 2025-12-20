import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-orange font-bold" : "text-navy hover:text-orange";

  return (
    <nav className="bg-white border-b-4 border-orange sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Hexagon className="text-orange fill-current" size={32} />
            <span className="text-2xl font-black text-navy uppercase tracking-tighter">
              Scrapcy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={isActive('/')}>HOME</Link>
            {/* NEW LINK ADDED HERE */}
            <Link to="/tracker" className={isActive('/tracker')}>MARKET PRICES</Link>
            <Link to="/auction" className={isActive('/auction')}>E-AUCTIONS</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="font-bold text-navy hover:text-orange text-sm">LOGIN</Link>
            <Link to="/register" className="bg-navy text-white px-6 py-2 font-bold uppercase text-sm hover:bg-orange transition-colors">
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-platinum border-t border-gray-200 py-4">
          <div className="flex flex-col gap-4 px-4 font-bold text-navy">
            <Link to="/" onClick={() => setIsOpen(false)}>HOME</Link>
            <Link to="/tracker" onClick={() => setIsOpen(false)}>MARKET PRICES</Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>LOGIN</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="text-orange">JOIN NOW</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
