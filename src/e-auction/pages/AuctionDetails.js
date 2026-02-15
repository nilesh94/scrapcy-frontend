import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Send, Ban } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI } from '../../services/eAuctionAPI';

const MyAuctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAuctions();
    fetchStats();
  }, [statusFilter, page]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        page_size: 10,
        status: statusFilter,
        search: searchTerm
      };
      const data = await auctionAPI.getAuctions(filters);
      
      // FIX: Handle both paginated response ({ auctions: [...] }) and direct array
      if (data && data.auctions) {
        setAuctions(data.auctions);
      } else if (Array.isArray(data)) {
        setAuctions(data);
      } else if (data && data.items) {
        setAuctions(data.items);
      } else {
        setAuctions([]);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await auctionAPI.getAuctionStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchAuctions();
  };

  const handleSubmitForApproval = async (auctionId) => {
    if (!window.confirm('Submit this auction for approval?')) return;
    
    try {
      await auctionAPI.submitForApproval(auctionId);
      alert('Auction submitted for approval!');
      fetchAuctions();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleCancelAuction = async (auctionId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    
    try {
      await auctionAPI.cancelAuction(auctionId, reason);
      alert('Auction cancelled successfully!');
      fetchAuctions();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-200 text-yellow-800',
      SCHEDULED: 'bg-blue-200 text-blue-800',
      LIVE: 'bg-green-200 text-green-800',
      CLOSED: 'bg-red-200 text-red-800',
      CANCELLED: 'bg-red-300 text-red-900'
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* Header */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            My Auctions
          </h1>
          <p className="text-orange text-sm font-bold uppercase tracking-widest">
            Manage Your E-Auctions
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-black text-navy">{stats.total_auctions || 0}</div>
              <div className="text-xs text-steel uppercase">Total Auctions</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-black text-green-600">{stats.live_auctions || 0}</div>
              <div className="text-xs text-steel uppercase">Live Now</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-black text-yellow-600">{stats.pending_approval || 0}</div>
              <div className="text-xs text-steel uppercase">Pending Approval</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-black text-blue-600">{stats.total_bids || 0}</div>
              <div className="text-xs text-steel uppercase">Total Bids Received</div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="flex-grow flex gap-2">
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-grow p-3 border border-platinum rounded focus:border-orange outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-navy text-white rounded hover:bg-orange transition-colors"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border border-platinum rounded focus:border-orange outline-none"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending Approval</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="LIVE">Live</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Create Button */}
            <Link
              to="/e-auction/register"
              className="px-6 py-3 bg-orange text-white rounded hover:bg-navy transition-colors font-bold uppercase text-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} /> New Auction
            </Link>
          </div>
        </div>

        {/* Auctions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-steel">
              Loading auctions...
            </div>
          ) : auctions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-steel mb-4">No auctions found</p>
              <Link
                to="/e-auction/register"
                className="inline-block px-6 py-3 bg-orange text-white rounded hover:bg-navy transition-colors font-bold"
              >
                Create Your First Auction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="p-4 text-left text-xs uppercase">Auction Title</th>
                    <th className="p-4 text-left text-xs uppercase">Category</th>
                    <th className="p-4 text-left text-xs uppercase">Start Date</th>
                    <th className="p-4 text-left text-xs uppercase">End Date</th>
                    <th className="p-4 text-left text-xs uppercase">Status</th>
                    <th className="p-4 text-left text-xs uppercase">Approval</th>
                    <th className="p-4 text-center text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction.id} className="border-b hover:bg-platinum/30">
                      <td className="p-4">
                        <div className="font-bold text-navy">{auction.auction_title}</div>
                        <div className="text-xs text-steel">ID: {auction.id}</div>
                      </td>
                      <td className="p-4 text-sm">{auction.category || '-'}</td>
                      <td className="p-4 text-sm">
                        {new Date(auction.scheduled_start_time).toLocaleString()}
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(auction.scheduled_end_time).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(auction.status)}`}>
                          {auction.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          auction.approval_status === 'L2_APPROVED' ? 'bg-green-200 text-green-800' :
                          auction.approval_status === 'L1_APPROVED' ? 'bg-blue-200 text-blue-800' :
                          auction.approval_status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {auction.approval_status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {/* View - Redirect to Management Page */}
                          <button
                            onClick={() => navigate(`/e-auction/auction/${auction.id}/manage`)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Edit (only if DRAFT) - Redirect to Management Page (Edit Mode) */}
                          {auction.status === 'DRAFT' && (
                            <button
                              onClick={() => navigate(`/e-auction/auction/${auction.id}/manage`)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          )}

                          {/* Submit for Approval (only if DRAFT) */}
                          {auction.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSubmitForApproval(auction.id)}
                              className="p-2 text-orange hover:bg-orange/10 rounded"
                              title="Submit for Approval"
                            >
                              <Send size={18} />
                            </button>
                          )}

                          {/* Cancel (if not CLOSED/CANCELLED) */}
                          {!['CLOSED', 'CANCELLED'].includes(auction.status) && (
                            <button
                              onClick={() => handleCancelAuction(auction.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                              title="Cancel Auction"
                            >
                              <Ban size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {auctions.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-platinum rounded hover:bg-platinum disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-platinum rounded">
              Page {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white border border-platinum rounded hover:bg-platinum"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyAuctions;
