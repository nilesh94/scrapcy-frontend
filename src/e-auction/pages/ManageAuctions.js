import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Eye, Edit, Trash2, Archive, RotateCcw, 
  CheckCircle, XCircle, Send, Download, Upload
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { auctionAPI } from '../../services/eAuctionAPI';

const ManageAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuctions, setSelectedAuctions] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    approval_status: '',
    search: '',
    date_from: '',
    date_to: '',
    category: '',
    page: 1,
    page_size: 20
  });

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [actionAuction, setActionAuction] = useState(null);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    fetchAuctions();
  }, [filters.status, filters.approval_status, filters.page]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const data = await auctionAPI.getAuctions(filters);
      setAuctions(data.items || data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      alert('Error loading auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
    fetchAuctions();
  };

  const handleSelectAuction = (auctionId) => {
    setSelectedAuctions(prev => 
      prev.includes(auctionId) 
        ? prev.filter(id => id !== auctionId)
        : [...prev, auctionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAuctions.length === auctions.length) {
      setSelectedAuctions([]);
    } else {
      setSelectedAuctions(auctions.map(a => a.id));
    }
  };

  const handleDeleteAuction = async () => {
    if (!actionAuction || !actionReason) {
      alert('Please provide a reason for deletion');
      return;
    }

    try {
      await auctionAPI.deleteAuction(actionAuction.id, actionReason);
      alert('Auction deleted successfully');
      setShowDeleteModal(false);
      setActionAuction(null);
      setActionReason('');
      fetchAuctions();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleArchiveAuction = async () => {
    if (!actionAuction || !actionReason) {
      alert('Please provide a reason for archiving');
      return;
    }

    try {
      await auctionAPI.archiveAuction(actionAuction.id, actionReason);
      alert('Auction archived successfully');
      setShowArchiveModal(false);
      setActionAuction(null);
      setActionReason('');
      fetchAuctions();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAuctions.length === 0) {
      alert('Please select auctions first');
      return;
    }

    const reason = prompt(`Enter reason for ${action}:`);
    if (!reason) return;

    try {
      for (const auctionId of selectedAuctions) {
        if (action === 'archive') {
          await auctionAPI.archiveAuction(auctionId, reason);
        } else if (action === 'delete') {
          await auctionAPI.deleteAuction(auctionId, reason);
        }
      }
      alert(`Bulk ${action} completed successfully`);
      setSelectedAuctions([]);
      fetchAuctions();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const exportAuctions = () => {
    // Export selected or all auctions to CSV
    const data = selectedAuctions.length > 0 
      ? auctions.filter(a => selectedAuctions.includes(a.id))
      : auctions;
    
    const csv = [
      ['ID', 'Title', 'Category', 'Status', 'Start Date', 'End Date', 'Total Bids'].join(','),
      ...data.map(a => [
        a.id,
        `"${a.auction_title}"`,
        a.category || '',
        a.status,
        new Date(a.scheduled_start_time).toISOString(),
        new Date(a.scheduled_end_time).toISOString(),
        a.total_bids || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auctions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-200 text-yellow-800',
      SCHEDULED: 'bg-blue-200 text-blue-800',
      LIVE: 'bg-green-200 text-green-800',
      CLOSED: 'bg-red-200 text-red-800',
      CANCELLED: 'bg-red-300 text-red-900',
      ARCHIVED: 'bg-gray-300 text-gray-700'
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
            Manage Auctions
          </h1>
          <p className="text-orange text-sm font-bold uppercase tracking-widest">
            Complete Auction Management & Control
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {/* Filters & Actions Bar */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search auctions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full p-3 border border-platinum rounded focus:border-orange outline-none"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="p-3 border border-platinum rounded focus:border-orange outline-none"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending Approval</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="LIVE">Live</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select
              value={filters.approval_status}
              onChange={(e) => setFilters({ ...filters, approval_status: e.target.value })}
              className="p-3 border border-platinum rounded focus:border-orange outline-none"
            >
              <option value="">All Approval Status</option>
              <option value="PENDING">Pending</option>
              <option value="L1_APPROVED">L1 Approved</option>
              <option value="L2_APPROVED">L2 Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="p-3 border border-platinum rounded focus:border-orange outline-none"
              placeholder="From Date"
            />
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="p-3 border border-platinum rounded focus:border-orange outline-none"
              placeholder="To Date"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-navy text-white rounded hover:bg-orange transition-colors font-bold uppercase text-sm flex items-center justify-center gap-2"
            >
              <Search size={18} /> Search
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedAuctions.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-platinum">
              <span className="flex items-center text-sm font-bold text-steel">
                {selectedAuctions.length} selected
              </span>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-4 py-2 bg-orange text-white rounded hover:bg-navy transition-colors text-sm font-bold flex items-center gap-2"
              >
                <Archive size={16} /> Archive Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-bold flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Selected
              </button>
              <button
                onClick={exportAuctions}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-bold flex items-center gap-2"
              >
                <Download size={16} /> Export Selected
              </button>
            </div>
          )}
        </div>

        {/* Auctions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-steel">
              Loading auctions...
            </div>
          ) : auctions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-steel mb-4">No auctions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedAuctions.length === auctions.length}
                        onChange={handleSelectAll}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 text-left text-xs uppercase">ID</th>
                    <th className="p-4 text-left text-xs uppercase">Auction Title</th>
                    <th className="p-4 text-left text-xs uppercase">Category</th>
                    <th className="p-4 text-left text-xs uppercase">Start Date</th>
                    <th className="p-4 text-left text-xs uppercase">Status</th>
                    <th className="p-4 text-left text-xs uppercase">Approval</th>
                    <th className="p-4 text-left text-xs uppercase">Bids</th>
                    <th className="p-4 text-center text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction.id} className="border-b hover:bg-platinum/30">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedAuctions.includes(auction.id)}
                          onChange={() => handleSelectAuction(auction.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 text-sm font-mono">{auction.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-navy">{auction.auction_title}</div>
                        <div className="text-xs text-steel">
                          {auction.auction_type} • {auction.region || 'All Regions'}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{auction.category || '-'}</td>
                      <td className="p-4 text-sm">
                        {new Date(auction.scheduled_start_time).toLocaleDateString()}
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
                      <td className="p-4 text-sm font-bold">{auction.total_bids || 0}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {/* View */}
                          <Link
                            to={`/e-auction/admin/view/${auction.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/e-auction/admin/edit/${auction.id}`}
                            className="p-2 text-green-600 hover:bg-green-100 rounded"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>

                          {/* Archive */}
                          {auction.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => {
                                setActionAuction(auction);
                                setShowArchiveModal(true);
                              }}
                              className="p-2 text-orange hover:bg-orange/10 rounded"
                              title="Archive"
                            >
                              <Archive size={18} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setActionAuction(auction);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>

                          {/* Audit Trail */}
                          <Link
                            to={`/e-auction/admin/audit/${auction.id}`}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded"
                            title="View Audit Trail"
                          >
                            <RotateCcw size={18} />
                          </Link>
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
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-steel">
              Showing {((filters.page - 1) * filters.page_size) + 1} to {Math.min(filters.page * filters.page_size, auctions.length)} of {auctions.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-white border border-platinum rounded hover:bg-platinum disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border border-platinum rounded">
                Page {filters.page}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="px-4 py-2 bg-white border border-platinum rounded hover:bg-platinum"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-black text-navy mb-4">Delete Auction</h3>
            <p className="text-steel mb-4">
              Are you sure you want to delete "<strong>{actionAuction?.auction_title}</strong>"?
              This action cannot be undone.
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Enter reason for deletion (required for audit trail)..."
              rows="3"
              className="w-full p-3 border border-platinum rounded focus:border-orange outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setActionAuction(null);
                  setActionReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-navy rounded hover:bg-gray-400 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAuction}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-black text-navy mb-4">Archive Auction</h3>
            <p className="text-steel mb-4">
              Archive "<strong>{actionAuction?.auction_title}</strong>"? 
              Archived auctions can be restored later.
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Enter reason for archiving (required for audit trail)..."
              rows="3"
              className="w-full p-3 border border-platinum rounded focus:border-orange outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setActionAuction(null);
                  setActionReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-navy rounded hover:bg-gray-400 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveAuction}
                className="flex-1 px-4 py-3 bg-orange text-white rounded hover:bg-navy transition-colors font-bold"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageAuctions;
