import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ListingCard from '../components/ListingCard'; // <--- Import New Component

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Failed to load listings.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure? This deletes the listing and images permanently.")) return;

    try {
        await axios.delete(`https://scrapcy-backend-new-1.onrender.com/scrap/${id}`);
        setListings(prev => prev.filter(item => item.id !== id));
        alert("Listing deleted.");
    } catch (err) {
        alert("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />
      
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
        
        {loading && <div className="text-center py-20 bg-white rounded shadow-xl">Loading...</div>}
        
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-8">{error}</div>}

        {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                    // Use the new ListingCard here
                    <ListingCard 
                        key={item.id} 
                        item={item} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminListings;
