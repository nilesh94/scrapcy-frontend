import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Anchor, LayoutDashboard, LogOut, LogIn, UserPlus, Home, Layers, Info, Code 
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
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

  return (
    <header className="bg-navy text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition" 
          onClick={() => navigate('/')}
        >
          <div className="bg-orange text-white p-1.5 rounded">
            <Anchor size={20} className="stroke-[3]" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">Scrapcy</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6">
          
          {/* --- PUBLIC LINKS (VISIBLE TO EVERYONE) --- */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Home size={14} /> Home
          </Link>

          <a 
            href="#features" 
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Layers size={14} /> Features
          </a>

          <a 
            href="#about" 
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Info size={14} /> About
          </a>

          <a 
            href="#css" 
            className="flex items-center gap-2 text-xs font-bold uppercase text-platinum hover:text-white transition"
          >
            <Code size={14} /> CSS
          </a>

          {/* DIVIDER */}
          <div className="h-4 w-px bg-white/20"></div>

          {/* --- CONDITIONAL LINKS --- */}
          {user ? (
            // STATE: LOGGED IN
            <>
              <span className="hidden md:block text-xs font-bold text-orange uppercase tracking-widest">
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
            // STATE: LOGGED OUT (GUEST)
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
