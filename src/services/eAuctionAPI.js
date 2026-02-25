/**
 * E-Auction API Service
 * All API calls for auction module
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const AUCTION_BASE = `${API_URL}/api/v1/e-auction`;

// Create axios instance with interceptor for JWT
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Auction CRUD Operations
 */
export const auctionAPI = {
  // UPDATED: Create new auction with optional Terms File
  createAuction: async (auctionData, termsFile = null, allLotImages = []) => {
    const formData = new FormData();
    
    // Always use FormData for consistency when images are involved
    formData.append('data', JSON.stringify(auctionData));
    
    if (termsFile) {
      formData.append('terms_doc', termsFile);
    }

    // Integrated creation: all images from all lots are flattened into one list
    allLotImages.forEach((file) => {
      formData.append('lot_images', file);
    });

    const response = await api.post(`${AUCTION_BASE}/auctions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
    if (filters.created_by_me) params.append('created_by_me', 'true');

    const response = await api.get(`${AUCTION_BASE}/auctions?${params.toString()}`);
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

  // Get single auction details (Public Basic Info)
  getAuctionById: async (auctionId) => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/${auctionId}`);
    return response.data;
  },

  // --- Get Full Details for View/Edit Page (Restricted) ---
  getAuctionDetails: async (auctionId) => {
    const response = await api.get(`${AUCTION_BASE}/auctions/${auctionId}/manage`);
    return response.data;
  },

  // --- Get Open Details for Public Website (Safe View) ---
  getOpenAuctionDetails: async (auctionId) => {
    const response = await axios.get(`${AUCTION_BASE}/auctions/open/${auctionId}`);
    return response.data;
  },

  // ABSOLUTELY REQUIRED UPDATE: Match the Multipart/Form-Data expected by Backend
  updateAuction: async (auctionId, auctionData, termsFile = null) => {
    // If a file is present, or if we want to support the backend's data: str = Form(...) requirement
    const formData = new FormData();
    
    // Wrap the JSON data in the 'data' field as a string
    formData.append('data', JSON.stringify(auctionData));
    
    // Add the file if it exists
    if (termsFile) {
        formData.append('terms_doc', termsFile);
    }

    const response = await api.put(`${AUCTION_BASE}/auctions/${auctionId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete auction (Updated)
  deleteAuction: async (auctionId, reason) => {
    const response = await api.delete(`${AUCTION_BASE}/auctions/${auctionId}`, {
      data: { reason }
    });
    return response.data;
  },

  // Submit for approval
  submitForApproval: async (auctionId) => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/submit-for-approval`);
    return response.data;
  },

  // Cancel auction
  cancelAuction: async (auctionId, reason) => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/cancel`, {
      cancellation_reason: reason
    });
    return response.data;
  },

  // Get auction statistics
  getAuctionStats: async () => {
    const response = await api.get(`${AUCTION_BASE}/auctions/stats/overview`);
    return response.data;
  },

  // --- NEW ADMIN METHODS START ---

  // Get admin statistics
  getAdminStats: async () => {
    const response = await api.get(`${AUCTION_BASE}/auctions/admin/stats/all`);
    return response.data;
  },

  // Get all auctions (admin view with filters)
  getAllAuctionsAdmin: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.approval_status) params.append('approval_status', filters.approval_status);
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const response = await api.get(`${AUCTION_BASE}/auctions?${params.toString()}`);
    return response.data;
  },

  // Archive auction (admin only)
  archiveAuction: async (auctionId, reason) => {
    const response = await api.post(
      `${AUCTION_BASE}/admin/auctions/${auctionId}/archive`,
      { reason }
    );
    return response.data;
  },

  // Restore archived auction (admin only)
  restoreAuction: async (auctionId) => {
    const response = await api.post(
      `${AUCTION_BASE}/admin/auctions/${auctionId}/restore`
    );
    return response.data;
  },

  // Get audit trail (admin only)
  getAuditTrail: async (auctionId) => {
    const response = await api.get(
      `${AUCTION_BASE}/admin/audit/${auctionId}`
    );
    return response.data;
  },

  // Get pending approvals (admin only)
  getPendingApprovalsAdmin: async (page = 1, pageSize = 10) => {
    const response = await api.get(
      `${AUCTION_BASE}/auctions/admin/pending-approval?page=${page}&page_size=${pageSize}`
    );
    return response.data;
  },

  // --- Participation & Workflow ---
  getParticipationSummary: async (auctionId) => {
    const response = await api.get(`${AUCTION_BASE}/auctions/${auctionId}/participation-summary`);
    return response.data;
  },

  performApprovalAction: async (auctionId, actionData) => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/approval-action`, actionData);
    return response.data;
  },
};

/**
 * Lot Management Operations
 */
export const lotAPI = {
  // Create lot (will be added to current auction creation - for now using lot endpoints)
  createLot: async (lotData) => {
    const response = await api.post(`${AUCTION_BASE}/lots`, lotData);
    return response.data;
  },

  // Get lots for an auction
  getAuctionLots: async (auctionId) => {
    const response = await api.get(`${AUCTION_BASE}/lots?auction_id=${auctionId}`);
    return response.data;
  },

  // ---Get Single Lot Details ---
  getLotDetails: async (lotId) => {
    const response = await api.get(`${AUCTION_BASE}/lots/${lotId}`);
    return response.data;
  },

  // --- UPDATED: Update Lot Details with Multipart Support ---
  updateLot: async (lotId, lotData, files = []) => {
    const formData = new FormData();
    formData.append('lot_data', JSON.stringify(lotData));
    
    // Add images if any
    files.forEach((file, index) => {
      // Index is 0 because we are updating a single specific lot
      formData.append('lot_images', file, `lot_0_file_${index}_${file.name}`);
    });

    const response = await api.put(`${AUCTION_BASE}/lots/${lotId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Upload lot images
  uploadLotImages: async (lotId, files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post(
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
    const response = await api.post(`${AUCTION_BASE}/bidding/lots/${lotId}/bid`, {
      bid_amount: bidAmount
    });
    return response.data;
  },

  // Get bid history
  getBidHistory: async (lotId, page = 1) => {
    const response = await api.get(`${AUCTION_BASE}/bidding/lots/${lotId}/history?page=${page}`);
    return response.data;
  },

  // Get my bids
  getMyBids: async (page = 1) => {
    const response = await api.get(`${AUCTION_BASE}/bidding/my-bids?page=${page}`);
    return response.data;
  },

  // Create auto-bid
  createAutoBid: async (lotId, maxBidAmount) => {
    const response = await api.post(`${AUCTION_BASE}/bidding/lots/${lotId}/auto-bid`, {
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
    const response = await api.post(`${AUCTION_BASE}/participants/auctions/${auctionId}/register`, {
      agreed_to_terms: true
    });
    return response.data;
  },

  // Get participants (admin only)
  getParticipants: async (auctionId) => {
    const response = await api.get(`${AUCTION_BASE}/participants/auctions/${auctionId}/participants`);
    return response.data;
  },
};

/**
 * Payment Operations
 */
export const paymentAPI = {
  // Initiate payment
  initiatePayment: async (paymentData) => {
    const response = await api.post(`${AUCTION_BASE}/payments/initiate`, paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (verificationData) => {
    const response = await api.post(`${AUCTION_BASE}/payments/verify`, verificationData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (page = 1) => {
    const response = await api.get(`${AUCTION_BASE}/payments/history?page=${page}`);
    return response.data;
  },
};

/**
 * Admin Operations
 */
export const adminAPI = {
  // Get pending approvals
  getPendingApprovals: async (page = 1) => {
    const response = await api.get(`${AUCTION_BASE}/auctions/admin/pending-approval?page=${page}`);
    return response.data;
  },

  // L1 Approval
  approveL1: async (auctionId, approve, remarks = '') => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/approve-l1`, {
      approve,
      remarks
    });
    return response.data;
  },

  // L2 Approval
  approveL2: async (auctionId, approve, remarks = '') => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/approve-l2`, {
      approve,
      remarks
    });
    return response.data;
  },

  // Publish auction manually
  publishAuction: async (auctionId) => {
    const response = await api.post(`${AUCTION_BASE}/auctions/${auctionId}/publish`);
    return response.data;
  },

  // Get all stats (admin only)
  getAllStats: async () => {
    const response = await api.get(`${AUCTION_BASE}/auctions/admin/stats/all`);
    return response.data;
  },

  // Get list of verified sellers for dropdown (admin only)
  getSellers: async (search = '') => {
    const response = await api.get(`${AUCTION_BASE}/admin/verified-sellers?q=${search}`);
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
