import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, Clock, CheckCircle, XCircle, 
  AlertTriangle, Users, DollarSign, FileText, Eye, Edit, Archive, PlusCircle, Gavel
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
// Assuming you have this service created, otherwise we can mock it
import { auctionAPI } from '../../services/eAuctionAPI'; 

const AdminAuctionDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for display if API fails or doesn't exist yet
      const mockStats = {
          total_auctions: 124,
          live_auctions: 3,
          pending_approval: 5,
          total_revenue: 4500000,
          total_bids: 1250,
          active_bidders: 85,
          avg_bid_value: 35000
      };
      
      // Replace with actual API calls when ready:
      // const statsData = await auctionAPI.getAuctionStats();
      setStats(mockStats);

      // const auctionsData = await auctionAPI.getAuctions({ page: 1, page_size: 5 });
      setRecentAuctions([]); // Populate with real data

      // const approvalsData = await auctionAPI.getPendingApprovals();
      setPendingApprovals([
          { id: 101, auction_title: "Copper Wire Scrap - Bulk", created_by: 45 },
          { id: 102, auction_title: "Industrial Machinery Liquidation", created_by: 22 }
      ]); 

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, link }) => (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-platinum">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs uppercase text-steel font-black tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-navy">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg shadow-sm ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {change && (
        <div className="flex items-center text-xs">
          <TrendingUp size={14} className="text-green-600 mr-1" />
          <span className="text-green-600 font-bold">{change}</span>
          <span className="text-steel ml-1">vs last month</span>
        </div>
      )}
    </Link>
  );

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      SCHEDULED: 'bg-blue-100 text-blue-800 border border-blue-200',
      LIVE: 'bg-green-100 text-green-800 border border-green-200 animate-pulse',
      CLOSED: 'bg-red-100 text-red-800 border border-red-200',
      CANCELLED: 'bg-gray-800 text-white',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* HEADER & ACTIONS */}
      <div className="bg-navy text-white py-10 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                <Gavel size={32} className="text-orange"/> E-Auction Admin
              </h1>
              <p className="text-orange text-sm font-bold uppercase tracking-widest pl-1">
                Control Center • Approvals • Live Monitoring
              </p>
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/e-auction/register"
                className="px-6 py-3 bg-green-600 text-white rounded shadow-lg hover:bg-green-700 transition-all font-bold uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <PlusCircle size={16} /> Register Auction
              </Link>
              <Link
                to="/e-auction/admin/manage"
                className="px-6 py-3 bg-orange text-white rounded shadow-lg hover:bg-white hover:text-navy transition-all font-bold uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> Manage Auctions
              </Link>
              <Link
                to="/e-auction/admin/approvals"
                className="px-6 py-3 bg-white text-navy rounded shadow-lg hover:bg-orange hover:text-white transition-all font-bold uppercase text-xs tracking-widest flex items-center gap-2 relative"
              >
                <CheckCircle size={16} /> Approvals
                {stats?.pending_approval > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                        {stats.pending_approval}
                    </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-navy rounded-full" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <p className="text-steel mt-4 font-bold">Loading dashboard metrics...</p>
          </div>
        ) : (
          <>
            {/* STATISTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Auctions"
                value={stats?.total_auctions || 0}
                change="+12%"
                icon={LayoutDashboard}
                color="bg-blue-600"
                link="/e-auction/admin/manage?status=all"
              />
              <StatCard
                title="Live Now"
                value={stats?.live_auctions || 0}
                icon={Radio} // Make sure to import Radio or use TrendingUp
                color="bg-green-600"
                link="/e-auction/admin/manage?status=LIVE"
              />
              <StatCard
                title="Pending Approval"
                value={stats?.pending_approval || 0}
                icon={AlertTriangle}
                color="bg-yellow-500"
                link="/e-auction/admin/approvals"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${(stats?.total_revenue / 100000).toFixed(1)} L`}
                change="+8%"
                icon={DollarSign}
                color="bg-purple-600"
                link="/e-auction/admin/reports"
              />
            </div>

            {/* SECONDARY STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-600 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-steel font-bold mb-1">Total Bids Placed</p>
                  <h4 className="text-2xl font-black text-navy">{stats?.total_bids || 0}</h4>
                </div>
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Gavel size={24} /></div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-600 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-steel font-bold mb-1">Active Bidders</p>
                  <h4 className="text-2xl font-black text-navy">{stats?.active_bidders || 0}</h4>
                </div>
                <div className="bg-green-50 p-3 rounded-full text-green-600"><Users size={24} /></div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow border-l-4 border-orange flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-steel font-bold mb-1">Avg. Winning Bid</p>
                  <h4 className="text-2xl font-black text-navy">₹{(stats?.avg_bid_value || 0).toLocaleString()}</h4>
                </div>
                <div className="bg-orange/10 p-3 rounded-full text-orange"><DollarSign size={24} /></div>
              </div>
            </div>

            {/* PENDING APPROVALS SECTION */}
            {pendingApprovals.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg mb-8 border border-yellow-200 overflow-hidden">
                <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex justify-between items-center">
                  <h2 className="text-sm font-black text-navy uppercase flex items-center gap-2">
                    <AlertTriangle className="text-yellow-600" size={18} />
                    Action Required: Pending Approvals
                  </h2>
                  <Link to="/e-auction/admin/approvals" className="text-yellow-700 hover:text-navy font-bold text-xs uppercase underline">
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-platinum">
                  {pendingApprovals.map((auction) => (
                    <div key={auction.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-yellow-50/50 transition-colors">
                      <div>
                        <h3 className="font-bold text-navy text-sm">{auction.auction_title}</h3>
                        <p className="text-xs text-steel mt-1">
                            <span className="font-mono bg-platinum px-1 rounded">ID: #{auction.id}</span> • 
                            Created by User #{auction.created_by}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/e-auction/admin/approve/${auction.id}`} className="px-4 py-2 bg-navy text-white rounded text-xs font-bold uppercase hover:bg-orange transition-colors">
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECENT AUCTIONS TABLE */}
            <div className="bg-white rounded-lg shadow-lg border border-platinum overflow-hidden">
              <div className="p-6 border-b border-platinum flex justify-between items-center">
                <h2 className="text-lg font-black text-navy uppercase flex items-center gap-2">
                  <FileText size={20} className="text-orange" /> Recent Auctions
                </h2>
                <Link to="/e-auction/admin/manage" className="text-steel hover:text-orange font-bold text-xs uppercase">View All →</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-platinum/50 text-navy text-xs uppercase font-bold">
                    <tr>
                      <th className="p-4 text-left">Auction Details</th>
                      <th className="p-4 text-left">Start Date</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-center">Bids</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum text-sm">
                    {recentAuctions.length > 0 ? recentAuctions.map((auction) => (
                      <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-navy">{auction.auction_title}</div>
                          <div className="text-xs text-steel mt-0.5">{auction.category || 'General Scrap'}</div>
                        </td>
                        <td className="p-4 text-steel">
                          {new Date(auction.scheduled_start_time).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getStatusBadge(auction.status)}`}>
                            {auction.status}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-navy">{auction.total_bids || 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/e-auction/admin/view/${auction.id}`} className="p-2 text-steel hover:text-blue-600 hover:bg-blue-50 rounded transition-all" title="View">
                              <Eye size={16} />
                            </Link>
                            <Link to={`/e-auction/admin/edit/${auction.id}`} className="p-2 text-steel hover:text-green-600 hover:bg-green-50 rounded transition-all" title="Edit">
                              <Edit size={16} />
                            </Link>
                            <button className="p-2 text-steel hover:text-red-600 hover:bg-red-50 rounded transition-all" title="Archive">
                              <Archive size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-steel italic">No recent auctions found.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

// Helper for Icon (if Radio not available in lucide-react version)
const Radio = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/></svg>
);

export default AdminAuctionDashboard;
