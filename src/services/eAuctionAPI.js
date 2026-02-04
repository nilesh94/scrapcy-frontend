/**
 * E-Auction API Service
 * All API calls for auction module
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const AUCTION_BASE = `${API_URL}/api/v1/e-auction`;

/**
 * Auction CRUD Operations
 */
export const auctionAPI = {
  // Create new auction
  createAuction: async (auctionData) => {
    const response = await axios.post(`${AUCTION_BASE}/auctions`, auctionData);
    return response.data;
  },

  // Get all auctions (with filters)
  getAuctions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const response = await axios.get(`${AUCTION_BASE}/auctions?${params.toString()}`);
    return response.data;
  },

  // Browse public auctions (no auth required)
  browseAuctions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.region) params.append('region', filters.region);
    if (filters.search) params.append('search', filters.search);
    params.append('page', filters.page || 1);
    params.append('page_size', filters.page_size || 20);

    const response = await axios.get(`${AUCTION_BASE}/auctions/browse?${params.toString()}`);
    return response.data;
  },

  // Get single auction details
  getAuctionById: async (auctionId) => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/${auctionId}`);
    return response.data;
  },

  // Update auction
  updateAuction: async (auctionId, auctionData) => {
    const response = await axios.put(`${AUCTION_BASE}/auctions/${auctionId}`, auctionData);
    return response.data;
  },

  // Delete auction
  deleteAuction: async (auctionId) => {
    const response = await axios.delete(`${AUCTION_BASE}/auctions/${auctionId}`);
    return response.data;
  },

  // Submit for approval
  submitForApproval: async (auctionId) => {
    const response = await axios.post(`${AUCTION_BASE}/auctions/${auctionId}/submit-for-approval`);
    return response.data;
  },

  // Cancel auction
  cancelAuction: async (auctionId, reason) => {
    const response = await axios.post(`${AUCTION_BASE}/auctions/${auctionId}/cancel`, {
      cancellation_reason: reason
    });
    return response.data;
  },

  // Get auction statistics
  getAuctionStats: async () => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/stats/overview`);
    return response.data;
  },
};

/**
 * Lot Management Operations
 */
export const lotAPI = {
  // Create lot (will be added to current auction creation - for now using lot endpoints)
  createLot: async (lotData) => {
    const response = await axios.post(`${AUCTION_BASE}/lots`, lotData);
    return response.data;
  },

  // Get lots for an auction
  getAuctionLots: async (auctionId) => {
    const response = await axios.get(`${AUCTION_BASE}/lots?auction_id=${auctionId}`);
    return response.data;
  },

  // Upload lot images
  uploadLotImages: async (lotId, files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post(
      `${AUCTION_BASE}/lots/${lotId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};

/**
 * Bidding Operations
 */
export const biddingAPI = {
  // Place bid
  placeBid: async (lotId, bidAmount) => {
    const response = await axios.post(`${AUCTION_BASE}/bidding/lots/${lotId}/bid`, {
      bid_amount: bidAmount
    });
    return response.data;
  },

  // Get bid history
  getBidHistory: async (lotId, page = 1) => {
    const response = await axios.get(`${AUCTION_BASE}/bidding/lots/${lotId}/history?page=${page}`);
    return response.data;
  },

  // Get my bids
  getMyBids: async (page = 1) => {
    const response = await axios.get(`${AUCTION_BASE}/bidding/my-bids?page=${page}`);
    return response.data;
  },

  // Create auto-bid
  createAutoBid: async (lotId, maxBidAmount) => {
    const response = await axios.post(`${AUCTION_BASE}/bidding/lots/${lotId}/auto-bid`, {
      max_bid_amount: maxBidAmount
    });
    return response.data;
  },
};

/**
 * Registration & Participation
 */
export const participantAPI = {
  // Register for auction
  registerForAuction: async (auctionId) => {
    const response = await axios.post(`${AUCTION_BASE}/participants/auctions/${auctionId}/register`, {
      agreed_to_terms: true
    });
    return response.data;
  },

  // Get participants (admin only)
  getParticipants: async (auctionId) => {
    const response = await axios.get(`${AUCTION_BASE}/participants/auctions/${auctionId}/participants`);
    return response.data;
  },
};

/**
 * Payment Operations
 */
export const paymentAPI = {
  // Initiate payment
  initiatePayment: async (paymentData) => {
    const response = await axios.post(`${AUCTION_BASE}/payments/initiate`, paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (verificationData) => {
    const response = await axios.post(`${AUCTION_BASE}/payments/verify`, verificationData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (page = 1) => {
    const response = await axios.get(`${AUCTION_BASE}/payments/history?page=${page}`);
    return response.data;
  },
};

/**
 * Admin Operations
 */
export const adminAPI = {
  // Get pending approvals
  getPendingApprovals: async (page = 1) => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/admin/pending-approval?page=${page}`);
    return response.data;
  },

  // L1 Approval
  approveL1: async (auctionId, approve, remarks = '') => {
    const response = await axios.post(`${AUCTION_BASE}/auctions/${auctionId}/approve-l1`, {
      approve,
      remarks
    });
    return response.data;
  },

  // L2 Approval
  approveL2: async (auctionId, approve, remarks = '') => {
    const response = await axios.post(`${AUCTION_BASE}/auctions/${auctionId}/approve-l2`, {
      approve,
      remarks
    });
    return response.data;
  },

  // Publish auction manually
  publishAuction: async (auctionId) => {
    const response = await axios.post(`${AUCTION_BASE}/auctions/${auctionId}/publish`);
    return response.data;
  },

  // Get all stats (admin only)
  getAllStats: async () => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/admin/stats/all`);
    return response.data;
  },
};

export default {
  auction: auctionAPI,
  lot: lotAPI,
  bidding: biddingAPI,
  participant: participantAPI,
  payment: paymentAPI,
  admin: adminAPI,
};
