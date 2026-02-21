import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hammer, ArrowRight, Building2, User, Unlock, LayoutDashboard, MessageSquare, X, Calendar, Clock, Package, MapPin
} from 'lucide-react';
import axios from 'axios';
import PriceCard from '../components/PriceCard';
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer'; 
import AuctionScrollCard from '../e-auction/components/AuctionScrollCard';

// --- COMPACT MOCK DATA ---
const MARKET_DATA = [
  { id: 101, category: "Ferrous", material: "MS Scrap", form: "Attachment", grade: "Ship Breaking", location: "Alang", price: 33600, unit: "MT", change: 200, contact: "Alang Recyclers" },
  { id: 104, category: "Ferrous", material: "Sponge Iron", form: "Pellets", grade: "DRI-78", location: "Raipur", price: 30500, unit: "MT", change: 200, contact: "Raipur Ispat" },
  { id: 105, category: "Ferrous", material: "Sponge Iron", form: "Lumps", grade: "DRI-80", location: "Durgapur", price: 34000, unit: "MT", change: -50, contact: "Durgapur Traders" },
  { id: 201, category: "Non Ferrous", material: "Copper", form: "Wire Scrap", grade: "Millberry", location: "Delhi", price: 785000, unit: "MT", change: 5000, contact: "Delhi Metal Exch" },
  { id: 202, category: "Non Ferrous", material: "Aluminium", form: "Extrusion", grade: "6063", location: "Mumbai", price: 212000, unit: "MT", change: -1000, contact: "Gujarat Alloys" },
  { id: 203, category: "Non Ferrous", material: "Brass", form: "Honey", grade: "IS-319", location: "Jamnagar", price: 490000, unit: "MT", change: 0, contact: "Jamnagar Brass" },
];

const MOCK_AUCTIONS = [
  { id: 3048, title: "Structural Steel Scrap", status: "LIVE", date: "26 Feb 2026", time: "04:00 PM", quantity: "500 MT", location: "Patna, Bihar", items: [{ name: "Heavy Melting Steel", qty: "500 MT", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000" }] },
  { id: 3049, title: "Aluminium Extrusion 6063", status: "UPCOMING", date: "02 Mar 2026", time: "11:00 AM", quantity: "50 MT", location: "Mumbai, MH", items: [{ name: "6063 Scrap", qty: "50 MT", img: "https://images.unsplash.com/photo-1605557626697-2e87166d88f9?q=80&w=1000" }] }
];

// --- CONTACT MODAL COMPONENT ---
const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', role: 'Buyer', query: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', role: 'Buyer', query: '' });
      onClose();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/90 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-steel hover:text-orange transition-colors"><X size={24}/></button>
        
        {submitted ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-4">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-black text-navy uppercase mb-2">Thank You!</h3>
            <p className="text-steel font-medium">Our Team will reach out to you shortly.</p>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-black text-navy uppercase mb-1">Get In Touch</h2>
            <p className="text-sm text-steel mb-6 font-medium">Fill out the form below and we'll contact you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Name</label>
                <input required type="text" className="w-full p-3 bg-platinum/30 border border-platinum rounded font-medium focus:border-orange outline-none" placeholder="Your Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Phone</label>
                  <input required type="tel" className="w-full p-3 bg-platinum/30 border border-platinum rounded font-medium focus:border-orange outline-none" placeholder="+91 98765..." value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase mb-1">Role</label>
                  <select className="w-full p-3 bg-platinum/30 border border-platinum rounded font-medium focus:border-orange outline-none" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}>
                    <option>Buyer</option>
                    <option>Seller</option>
                    <option>Trader</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Email (Optional)</label>
                <input type="email" className="w-full p-3 bg-platinum/30 border border-platinum rounded font-medium focus:border-orange outline-none" placeholder="name@example.com" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Query</label>
                <textarea required rows="3" className="w-full p-3 bg-platinum/30 border border-platinum rounded font-medium focus:border-orange outline-none" placeholder="I am interested in..." value={formData.query} onChange={e=>setFormData({...formData, query: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-orange text-white font-black uppercase tracking-widest hover:bg-navy transition-colors rounded shadow-lg mt-2">
                Submit Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [user, setUser] = useState(null); 
  const [userRole, setUserRole] = useState('guest'); 
  const [isContactOpen, setIsContactOpen] = useState(false); // Contact Modal State
  const [selectedAuction, setSelectedAuction] = useState(null); // Auction Modal State
  const [auctionData, setAuctionData] = useState([]); // Real API Data

  // 1. Check Login Status on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role === 'seller' ? 'company' : 'bidder');
    }
  }, []);

  // 2. Fetch Real Auction Data from Open API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/api/v1/e-auction/auctions/listing');
        if (response.data.auctions && response.data.auctions.length > 0) {
          // Format API data to match Component expectations
          const formatted = response.data.auctions.map(auc => ({
            id: auc.id,
            title: auc.auction_title,
            status: auc.status,
            date: new Date(auc.scheduled_start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(auc.scheduled_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: auc.region,
            quantity: auc.quantity || "TBD",
            items: auc.items || []
          }));
          setAuctionData(formatted);
        } else {
          setAuctionData(MOCK_AUCTIONS);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctionData(MOCK_AUCTIONS);
      }
    };
    fetchAuctions();
  }, []);

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
    <div className="min-h-screen bg-platinum flex flex-col relative">
      <Header />

      {/* CONTACT MODAL */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* AUCTION DETAIL MODAL */}
      {selectedAuction && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-navy/90 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelectedAuction(null)} className="absolute top-4 right-4 text-navy hover:text-orange z-10 bg-white rounded-full p-1">
              <X size={24} />
            </button>
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto bg-platinum">
                <img src={selectedAuction.items[0]?.image_url || selectedAuction.items[0]?.img || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000"} className="w-full h-full object-cover" alt="Lot" />
              </div>
              <div className="md:w-1/2 p-8">
                <span className="text-orange font-black text-xs uppercase tracking-widest">{selectedAuction.status}</span>
                <h2 className="text-3xl font-black text-navy uppercase mb-4 leading-none">{selectedAuction.title}</h2>
                <div className="space-y-3 mb-8">
                   <p className="text-steel font-bold flex items-center gap-2">Auction ID: <span className="text-navy">{selectedAuction.id}</span></p>
                   <p className="text-steel font-bold flex items-center gap-2">Date: <span className="text-navy">{selectedAuction.date}</span></p>
                   <p className="text-steel font-bold flex items-center gap-2">Time: <span className="text-navy">{selectedAuction.time}</span></p>
                   <p className="text-steel font-bold flex items-center gap-2">Location: <span className="text-navy">{selectedAuction.location}</span></p>
                </div>
                <button onClick={() => navigate('/login')} className="w-full bg-navy text-white py-4 font-black uppercase tracking-widest hover:bg-orange transition-colors">
                  Login to Participate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        
        {/* --- FLOATING DASHBOARD BUTTON (ONLY FOR LOGGED IN USERS) --- */}
        {user && (
          <button
            onClick={() => navigate('/dashboard')}
            className="fixed bottom-8 right-8 z-50 bg-navy text-white px-6 py-4 rounded-full shadow-2xl border-2 border-orange hover:scale-105 transition-transform duration-300 flex items-center gap-3 font-black uppercase tracking-widest text-xs group"
          >
            <LayoutDashboard size={20} className="text-orange group-hover:text-white transition-colors" />
            <span className="hidden md:inline">My Dashboard</span>
          </button>
        )}

        {/* Ticker */}
        <div className="bg-orange text-white py-2 overflow-hidden border-b-4 border-navy">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => (
               <span key={i} className="mx-8 font-bold uppercase italic tracking-wider flex items-center gap-2 text-sm">
                  <span className="text-navy">LIVE:</span> {item.material} ({item.location}) 
                  <span className={item.change > 0 ? "text-green-100" : "text-red-100"}>
                    {/* UPDATED: Added /Unit here */}
                    ₹{item.price.toLocaleString()}/{item.unit}
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
            
            {/* Main Hero Button (Changed to Contact Form Trigger) */}
            <button 
              onClick={() => setIsContactOpen(true)}
              className="bg-navy text-white px-8 py-4 font-bold flex items-center gap-2 hover:bg-orange transition-all duration-300 shadow-lg shadow-navy/20 uppercase tracking-wide"
            >
                Get In Touch <MessageSquare size={20}/>
            </button>
          </div>
          <div className="rounded-lg shadow-2xl overflow-hidden bg-steel/10 p-2 border border-platinum-dark">
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=90&w=2400" alt="Scrap Yard" className="rounded grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover"/>
          </div>
        </section>

        {/* --- LIVE & UPCOMING AUCTIONS SCROLL --- */}
        <section className="bg-white py-12 border-b-4 border-platinum overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-navy flex items-center gap-3">
                  <Hammer size={28} className="text-orange" /> Live & Upcoming Auctions
                </h2>
                <p className="text-steel font-medium font-semibold">Verified industrial scrap lots</p>
              </div>
              <button 
                onClick={() => navigate('/auctions-all')} 
                className="flex items-center gap-2 text-navy font-black uppercase hover:text-orange transition-colors border-b-2 border-navy pb-1"
              >
                View All <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2">
              {auctionData.map((auc) => (
                <AuctionScrollCard key={auc.id} auction={auc} onClick={setSelectedAuction} />
              ))}
            </div>
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

      <Footer />
    </div>
  );
};

export default Home;
