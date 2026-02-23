import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Package, Clock, CheckCircle, AlertCircle, 
  ChevronRight, LayoutDashboard, Search, Filter 
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI } from '../../services/eAuctionAPI';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({
    draft: 0,
    pending: 0,
    active: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        setLoading(true);
        // This endpoint should filter auctions where created_by = current_user.id 
        const data = await auctionAPI.getMyAuctions(); 
        setAuctions(data);
        
        // Calculate v3.0 logic-based stats [cite: 202, 447]
        const dashboardStats = {
          draft: data.filter(a => a.approval_status === 'DRAFT').length,
          pending: data.filter(a => a.approval_status.startsWith('PENDING')).length,
          active: data.filter(a => a.status === 'LIVE' || a.status === 'SCHEDULED').length,
          rejected: data.filter(a => a.approval_status === 'REJECTED').length
        };
        setStats(dashboardStats);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerAuctions();
  }, []);

  const getStatusColor = (status, type) => {
    if (type === 'approval') {
      const colors = {
        DRAFT: 'text-gray-500 bg-gray-100',
        PENDING_L1: 'text-yellow-600 bg-yellow-50',
        PENDING_L2: 'text-blue-600 bg-blue-50',
        PENDING_ADMIN: 'text-purple-600 bg-purple-50',
        READY_TO_PUBLISH: 'text-green-600 bg-green-50',
        PUBLISHED: 'text-green-700 bg-green-100',
        REJECTED: 'text-red-600 bg-red-50'
      };
      return colors[status] || 'text-gray-500 bg-gray-100';
    }
    // Operational Status colors [cite: 198, 246]
    const opColors = {
      LIVE: 'text-white bg-green-600 animate-pulse',
      SCHEDULED: 'text-white bg-indigo-600',
      CLOSED: 'text-white bg-red-800',
      DRAFT: 'text-gray-600 bg-gray-200'
    };
    return opColors[status] || 'text-gray-500 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* --- Top Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-navy uppercase flex items-center gap-3">
              <LayoutDashboard className="text-orange" size={32} />
              Seller Central
            </h1>
            <p className="text-gray-500 font-bold text-sm">Manage your scrap auctions and track approval progress [cite: 178]</p>
          </div>
          <button 
            onClick={() => navigate('/e-auction/create')}
            className="flex items-center gap-2 bg-orange text-navy font-black px-6 py-3 rounded shadow-lg hover:bg-navy hover:text-white transition-all transform hover:-translate-y-1"
          >
            <Plus size={20} /> CREATE NEW AUCTION
          </button>
        </div>

        {/* --- Statistics Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Drafts', value: stats.draft, icon: Package, color: 'border-gray-400' },
            { label: 'In Review', value: stats.pending, icon: Clock, color: 'border-blue-500' },
            { label: 'Active/Scheduled', value: stats.active, icon: CheckCircle, color: 'border-green-600' },
            { label: 'Action Required', value: stats.rejected, icon: AlertCircle, color: 'border-red-500' }
          ].map((s, idx) => (
            <div key={idx} className={`bg-white p-5 rounded shadow border-l-4 ${s.color}`}>
              <div className="flex justify-between items-center">
                <s.icon className="text-gray-300" size={24} />
                <span className="text-2xl font-black text-navy">{s.value}</span>
              </div>
              <p className="text-xs font-bold uppercase text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* --- Auction List --- */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
            <h2 className="text-lg font-black text-navy uppercase">Recent Auction Postings</h2>
            <div className="flex gap-2">
               <div className="relative">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                 <input type="text" placeholder="Search title..." className="pl-9 pr-4 py-2 border rounded text-xs focus:ring-1 focus:ring-orange outline-none w-64" />
               </div>
               <button className="p-2 border rounded text-gray-500 hover:bg-gray-100"><Filter size={18} /></button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Records...</div>
            ) : auctions.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">No auctions found. Start by creating your first listing!</div>
            ) : (
              auctions.map((auc) => (
                <div 
                  key={auc.id} 
                  onClick={() => navigate(`/e-auction/auction/${auc.id}/manage`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="w-full md:w-1/3">
                    <h3 className="font-black text-navy uppercase truncate">{auc.auction_title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-tighter">ID: #{auc.id} • CREATED: {new Date(auc.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Approval Stage [cite: 199]</span>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${getStatusColor(auc.approval_status, 'approval')}`}>
                        {auc.approval_status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Live Status [cite: 199]</span>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${getStatusColor(auc.status, 'operational')}`}>
                        {auc.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4 w-full md:w-auto justify-end">
                    <div className="hidden md:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Lots</p>
                      <p className="text-sm font-black text-navy">{auc.items?.length || 0}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
