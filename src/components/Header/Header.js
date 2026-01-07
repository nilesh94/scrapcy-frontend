import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Anchor, LayoutDashboard, LogOut, LogIn, UserPlus, 
  Home, Layers, Info 
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // 1. Check Login Status on Mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // 3. Handle Scroll for Anchor Links (Features, About)
  const handleScroll = (id) => {
    // If we are on the Home page, scroll smoothly
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on Dashboard or Login, navigate to Home first
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <header className="bg-navy text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* --- LEFT: LOGO --- */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition" 
          onClick={() => navigate('/')}
        >
          <div className="bg-orange text-white p-1.5 rounded">
            <Anchor size={20} className="stroke-[3]" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Scrapcy</span>
        </div>

        {/* --- RIGHT: NAVIGATION --- */}
        <nav className="flex items-center gap-6">
          
          {/* 1. PUBLIC MENU ITEMS */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Home size={14} /> Home
          </Link>

          <button 
            onClick={() => handleScroll('features')}
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Layers size={14} /> Features
          </button>

          <button 
            onClick={() => handleScroll('about')}
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Info size={14} /> About
          </button>

          {/* DIVIDER */}
          <div className="h-4 w-px bg-white/20 mx-2"></div>

          {/* 2. AUTH MENU ITEMS (Conditional) */}
          {user ? (
            // STATE: LOGGED IN
            <>
              <span className="hidden md:block text-xs font-bold text-orange uppercase tracking-widest mr-2">
                Hi, {user.first_name}
              </span>

              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            // STATE: GUEST
            <>
              <Link 
                to="/login"
                className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
              >
                <LogIn size={14} /> Login
              </Link>

              <Link 
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-orange text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-white hover:text-navy transition-all"
              >
                <UserPlus size={14} /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
