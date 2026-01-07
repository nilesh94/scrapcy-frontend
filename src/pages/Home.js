import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, LayoutDashboard, LogOut, LogIn, UserPlus, 
  ShieldCheck, TrendingUp, Globe, Anchor 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check Login Status on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-white font-sans text-navy">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-platinum py-4 sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-orange text-white p-2 rounded">
              <Anchor size={20} className="stroke-[3]" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">Scrapcy</span>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:block text-xs font-bold text-steel uppercase tracking-widest mr-2">
                  Welcome, {user.first_name}
                </span>
                
                {/* ONE SIMPLE LINK TO DASHBOARD */}
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-navy hover:text-orange transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-navy text-white text-xs font-black uppercase tracking-widest rounded shadow-lg hover:bg-red-600 transition-all"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-navy hover:text-orange transition-colors">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-5 py-2.5 bg-orange text-white text-xs font-black uppercase tracking-widest rounded shadow-lg hover:bg-navy transition-all">
                  <UserPlus size={16} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative py-24 px-6 bg-platinum/30 border-b border-platinum">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-navy text-[10px] font-black uppercase tracking-widest rounded-full">
            <Globe size={14} className="text-orange" />
            Global Industrial Marketplace
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-navy leading-none">
            Turn Scrap into <span className="text-orange">Capital</span>.
          </h1>
          
          <p className="text-lg text-steel font-medium max-w-2xl mx-auto leading-relaxed">
            The world's most trusted platform for buying and selling industrial ferrous and non-ferrous metals. Verified sellers, secure payments, and real-time bidding.
          </p>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
            {/* SMART ACCESS BUTTON - Just links to /dashboard now */}
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="px-8 py-4 bg-navy text-white text-sm font-black uppercase tracking-widest rounded shadow-xl hover:bg-orange transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Access Portal <ArrowRight size={18} />
            </button>
            
            <button className="px-8 py-4 bg-white border-2 border-platinum text-navy text-sm font-black uppercase tracking-widest rounded hover:border-navy transition-all">
              View Market Rates
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<ShieldCheck size={32} className="text-orange"/>} title="Verified Sellers" desc="Every company on Scrapcy undergoes strict GST and PAN verification before listing materials." />
            <FeatureCard icon={<TrendingUp size={32} className="text-blue-500"/>} title="Real-Time Bidding" desc="Experience live auctions with zero latency. Place bids and track competitors instantly." />
            <FeatureCard icon={<Globe size={32} className="text-green-600"/>} title="Pan-India Logistics" desc="Integrated logistics support ensures your scrap reaches the recycling plant on time." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white border border-platinum rounded-xl hover:shadow-2xl hover:border-orange transition-all duration-300 group cursor-default">
    <div className="mb-6 p-4 bg-platinum/30 rounded-lg inline-block group-hover:bg-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-black uppercase text-navy mb-3">{title}</h3>
    <p className="text-steel text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;
