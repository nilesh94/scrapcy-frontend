import React, { useState, useEffect } from 'react';
import { Search, User, Check } from 'lucide-react';
import { adminAPI } from '../../services/eAuctionAPI'; // Import the API we just added

const SellerSelect = ({ currentUser, value, onChange, error }) => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSellerName, setSelectedSellerName] = useState('');

  // 1. Logic for SELLER (Auto-populate)
  useEffect(() => {
    if (currentUser?.role === 'seller') {
      // Automatically set the ID to the logged-in user
      onChange(currentUser.id);
      setSelectedSellerName(currentUser.full_name || currentUser.username || 'Me');
    }
  }, [currentUser]);

  // 2. Logic for ADMIN (Fetch list)
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const fetchSellers = async () => {
        setLoading(true);
        try {
          // Fetch sellers matching search term
          // Ensure your API returns an array of users
          const data = await adminAPI.getSellers(searchTerm);
          setSellers(Array.isArray(data) ? data : data.users || []); // Handle response format
        } catch (err) {
          console.error("Failed to fetch sellers", err);
        } finally {
          setLoading(false);
        }
      };

      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(() => fetchSellers(), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentUser, searchTerm]);

  // --- RENDER FOR SELLER (Read Only) ---
  if (currentUser?.role === 'seller') {
    return (
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
          Selling As
        </label>
        <div className="flex items-center gap-2 p-2 bg-gray-100 border border-gray-200 rounded text-navy font-bold text-sm">
          <User size={16} className="text-gray-500" />
          {selectedSellerName} (You)
        </div>
      </div>
    );
  }

  // --- RENDER FOR ADMIN (Searchable Dropdown) ---
  return (
    <div className="mb-4 relative">
      <label className="block text-xs font-bold uppercase text-navy mb-1">
        Assign Seller *
      </label>
      
      {/* Search Input Trigger */}
      <div 
        className={`flex items-center gap-2 p-2 border rounded cursor-text ${error ? 'border-red-500' : 'border-gray-300 focus-within:border-orange'}`}
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} className="text-gray-400" />
        <input 
          type="text"
          className="w-full outline-none text-sm font-bold placeholder-gray-400"
          placeholder={value ? selectedSellerName : "Search for a seller..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onChange(null); // Reset selection if typing new search
          }}
          onFocus={() => setIsOpen(true)}
        />
        {value && <Check size={16} className="text-green-600" />}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Dropdown List */}
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-xs text-gray-500 text-center">Loading sellers...</div>
            ) : sellers.length > 0 ? (
              <ul>
                {sellers.map((seller) => (
                  <li 
                    key={seller.id}
                    onClick={() => {
                      onChange(seller.id);
                      setSelectedSellerName(seller.full_name || seller.username);
                      setSearchTerm(''); // Clear search logic, keep display name separate if needed or use search term
                      setIsOpen(false);
                    }}
                    className={`p-2 hover:bg-orange hover:text-white cursor-pointer text-sm flex justify-between items-center ${value === seller.id ? 'bg-orange/10 text-orange font-bold' : 'text-gray-700'}`}
                  >
                    <span>{seller.full_name || seller.username}</span>
                    <span className="text-xs opacity-70">ID: {seller.id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-xs text-gray-500 text-center">No sellers found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SellerSelect;
