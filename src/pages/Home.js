import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Hammer, ArrowRight, Building2, User, Unlock, Anchor, 
  LayoutDashboard, LogOut, LogIn, UserPlus 
} from 'lucide-react';
import PriceCard from '../components/PriceCard'; // Ensure this path is correct

const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "Sponge Iron", location: "Raipur", price: 30500, change: 200, type: "Mandi", contact: "Raipur Ispat Links" },
  { id: 102, category: "Ferrous", material: "Sponge Iron", location: "Durgapur", price: 34000, change: -150, type: "Mandi", contact: "Durgapur Foundries" },
  { id: 103, category: "Ferrous", material: "Sponge Iron", location: "Bellary", price: 32200, change: 0, type: "Mandi", contact: "Bellary Steels" },
  { id: 201, category: "Non-Ferrous", material: "Copper", location: "Delhi", price: 785, change: 12, type: "Millberry", contact: "Delhi Metal Exch" },
  { id: 202, category: "Non-Ferrous", material: "Copper", location: "Mumbai", price: 760, change: -5, type: "Armature", contact: "Mumbai Scrap Corp" },
  { id: 203, category: "Non-Ferrous", material: "Aluminium", location: "Alang", price: 212, change: -3, type: "Wire", contact: "Gujarat Alloys" },
];

const Home = () => {
  const navigate = useNavigate();
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [user, setUser] = useState(null); // Replaces userRole, holds full user object
  const [userRole, setUserRole] = useState('guest'); // Kept for the auction section toggle logic

  // 1. Check Login Status on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role === 'seller' ? 'company' : 'bidder'); // Sync role for UI
    }
  }, []);

  // 2. Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole('guest');
    window.location.reload(); 
  };

  // 3. Calculate Averages
  const materialAverages = useMemo(() => {
    const sums = {}; const counts = {};
    MARKET_DATA.forEach(item => {
      if (!sums[item.material]) { sums[item.material] = 0; counts[item.material] = 0; }
      sums[item.material] += item.price;
      counts[item.material] += 1;
    });
    const avgs = {};
    for (const mat in sums) avgs[mat] = sums[mat] / counts[mat];
    return avgs;
  }, []);

  const handleUnlockPrice = (id) => {
    if (window.confirm("Unlock verified contact details for $5?")) {
      setTimeout(() => setUnlockedDetails(prev => ({ ...prev, [id]: true })), 500);
    }
  };

  return (
    <main className="bg-platinum min-h-screen">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-platinum py-4 sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-orange text-white p-2 rounded">
              <Anchor size={20} className="stroke-[3]" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-navy">Scrapcy</span>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden md:block text-xs font-bold text-steel uppercase tracking-widest mr-2">
                  Welcome, {user.first_name}
                </span>
                
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

      {/* Ticker */}
      <div className="bg-orange text-white py-2 overflow-hidden border-b-4 border-navy">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => (
             <span key={i} className="mx-8 font-bold uppercase italic tracking-wider flex items-center gap-2 text-sm">
                <span className="text-navy">LIVE:</span> {item.material} ({item.location}) 
                <span className={item.change > 0 ? "text-green-100" : "text-red-100"}>
                  {item.price.toLocaleString()}
                </span>
             </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-orange font-black tracking-widest uppercase text-sm italic">Industrial Authority</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6 mt-2 text-navy">The Hub of <br/>Scrap Trade</h1>
          <p className="text-lg text-steel font-medium mb-8">A premium, high-integrity platform bridging scrap producers and professional bidders.</p>
          
          {/* Smart Redirect Button */}
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300 shadow-lg shadow-navy/20"
          >
              {user ? 'GO TO DASHBOARD' : 'EXPLORE MARKET'} <ArrowRight size={20}/>
          </button>
        </div>
        <div className="rounded-lg shadow-2xl overflow-hidden bg-steel/10 p-2 border border-platinum-dark">
          <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" alt="Scrap Yard" className="rounded grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"/>
        </div>
      </section>

      {/* Price Cards Scroll */}
      <section id="prices" className="bg-white py-16 border-y-4 border-platinum">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl font-black uppercase italic tracking-tighter text-navy">Regional Price Comparison</h2>
               <p className="text-steel font-medium">Comparing prices against National Average</p>
            </div>
            <button onClick={() => navigate('/tracker')} className="flex items-center gap-2 text-orange font-black uppercase hover:text-navy transition-colors border-b-2 border-orange pb-1">
              See All Markets <ArrowRight size={18} />
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 px-2 scrollbar-hide">
            {MARKET_DATA.slice(0, 6).map((item) => (
               <div key={item.id} className="min-w-[320px]">
                  <PriceCard 
                    item={item} 
                    averagePrice={materialAverages[item.material]}
                    isUnlocked={unlockedDetails[item.id]}
                    onUnlock={handleUnlockPrice}
                  />
               </div>
            ))}
            <div onClick={() => navigate('/tracker')} className="min-w-[320px] border-4 border-dashed border-platinum bg-platinum/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange hover:bg-orange/5 transition-all group rounded-xl">
              <div className="p-4 rounded-full bg-white border-2 border-platinum group-hover:border-orange mb-4 shadow-sm">
                <ArrowRight size={32} className="text-steel group-hover:text-orange" />
              </div>
              <h3 className="text-xl font-black uppercase text-navy">View All Prices</h3>
            </div>
          </div>
        </div>
      </section>

      {/* E-Auction Section */}
      <section id="auction" className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none"><Hammer size={400} /></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">E-Auction <span className="text-orange">Portal</span></h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
            
            {/* SELLER CARD */}
            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'company' ? 'border-orange bg-white/5' : 'border-white/10 opacity-80'}`}>
              <Building2 className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR SELLERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Post bulk auctions and manage inventory.</p>
              {user && user.role === 'seller' ? ( 
                <button onClick={() => navigate('/dashboard')} className="bg-orange text-white w-full py-4 font-black uppercase hover:bg-white hover:text-navy transition-colors rounded">Go to Dashboard</button> 
              ) : ( 
                <button onClick={() => navigate('/register')} className="border border-white/20 w-full py-4 text-xs font-bold hover:bg-white/10 rounded">REGISTER AS SELLER</button> 
              )}
            </div>

            {/* BIDDER CARD */}
            <div className={`p-8 border-2 rounded-xl transition-all ${userRole === 'bidder' ? 'border-orange bg-white/5' : 'border-white/10 opacity-80'}`}>
              <User className="text-orange mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2">FOR BIDDERS</h3>
              <p className="text-sm text-platinum/70 mb-8">Access premium lots. Requires EMD.</p>
              {user && user.role !== 'seller' ? ( 
                <button onClick={() => navigate('/dashboard')} className="bg-green-600 text-white w-full py-4 font-black uppercase flex justify-center gap-2 hover:bg-green-500 transition-colors rounded"><Unlock size={18}/> Enter Room</button> 
              ) : ( 
                <button onClick={() => navigate('/register')} className="border border-white/20 w-full py-4 text-xs font-bold hover:bg-white/10 rounded">REGISTER AS BIDDER</button> 
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
