import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, MapPin, Phone, Trash2, ExternalLink, Calendar, Package 
} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Listings on Load
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('https://scrapcy-backend-new-1.onrender.com/scrap/all');
      setListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError('Failed to load listings. Please check backend connection.');
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-navy text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Manage Listings</h1>
                <p className="text-orange text-sm font-bold uppercase tracking-widest">
                    Admin Console • {listings.length} Active Listings
                </p>
            </div>
            <a href="/admin" className="bg-orange hover:bg-white hover:text-navy text-white font-bold py-2 px-6 rounded transition-all uppercase text-xs tracking-widest">
                + Add New
            </a>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 w-full -mt-8 pb-20 relative z-10">
        
        {/* Loading State */}
        {loading && (
            <div className="text-center py-20 bg-white rounded shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
                <p className="text-navy font-bold">Loading Inventory...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg mb-8">
                <p>{error}</p>
            </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border-t-4 border-orange group">
                        
                        {/* Image Section */}
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {item.images && item.images.length > 0 ? (
                                <img 
                                    src={item.images[0].image_url} 
                                    alt="Scrap" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <LayoutDashboard size={40} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-navy text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {item.scrap_type}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-navy leading-tight mb-1">
                                        {item.quantity} {item.unit}
                                    </h3>
                                    <p className="text-sm text-steel font-medium">
                                        ₹{item.price_per_unit} {item.price_unit}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                                        ACTIVE
                                    </span>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <div className="flex items-start gap-2">
                                    <Package size={16} className="text-orange mt-1 flex-shrink-0" />
                                    <span className="line-clamp-2">{item.description || "No description provided."}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-orange flex-shrink-0" />
                                    <span className="truncate">{item.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-orange flex-shrink-0" />
                                    <span>{item.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-orange flex-shrink-0" />
                                    <span>Added: {formatDate(item.created_at)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                <button className="flex justify-center items-center gap-2 text-xs font-bold uppercase py-2 bg-platinum hover:bg-gray-200 text-navy rounded transition-colors">
                                    <ExternalLink size={14} /> View
                                </button>
                                <button className="flex justify-center items-center gap-2 text-xs font-bold uppercase py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {!loading && listings.length === 0 && (
            <div className="text-center py-20 bg-white rounded shadow-xl">
                <p className="text-gray-500">No listings found. Start by adding one!</p>
            </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default AdminListings;
