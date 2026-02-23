import React, { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingUp } from 'lucide-react';

const BiddingLotCard = ({ lot, auctionId }) => {
  const [currentPrice, setCurrentPrice] = useState(lot.highest_bid_amount || lot.starting_bid_amount);
  const [isWinning, setIsWinning] = useState(false);
  const [ws, setWs] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    // Connect to specific Lot WebSocket
    const user = JSON.parse(localStorage.getItem('user'));
    const socket = new WebSocket(`ws://localhost:8000/api/v1/e-auction/ws/lots/${lot.id}/live?user_id=${user.id}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event_type === 'BID_PLACED' || data.event_type === 'INITIAL_STATE') {
        setCurrentPrice(data.highest_bid || data.current_price);
        setIsWinning(data.is_winning);
      }
      if (data.event_type === 'AUCTION_CLOSED') {
        // Handle closure UI
      }
    };

    setWs(socket);
    return () => socket.close();
  }, [lot.id]);

  const handlePlaceBid = () => {
    const payload = {
       lot_id: lot.id,
       bid_amount: parseFloat(bidAmount)
    };
    // Send via standard POST API to trigger the Database Lock logic
    // auctionAPI.placeBid(payload);
    setBidAmount("");
  };

  return (
    <div className={`bg-white rounded-lg shadow-2xl overflow-hidden border-t-8 ${isWinning ? 'border-green-500' : 'border-orange'}`}>
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <span className="font-black text-navy uppercase text-sm">Lot #{lot.lot_number}</span>
        <div className="flex items-center gap-1 text-red-600 font-bold text-xs animate-pulse">
            <Clock size={14} /> LIVE
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-black text-navy truncate mb-4">{lot.item_name}</h3>
        
        <div className="bg-navy text-white p-4 rounded mb-4 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Current Highest Bid</span>
            <span className="text-3xl font-black text-orange">₹{currentPrice.toLocaleString()}</span>
        </div>

        <div className="space-y-3">
            <div className="flex gap-2">
                <input 
                  type="number" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ₹${(currentPrice + lot.min_increment_amount).toLocaleString()}`}
                  className="flex-grow p-3 border-2 border-gray-200 rounded font-bold outline-none focus:border-navy"
                />
                <button 
                  onClick={handlePlaceBid}
                  className="bg-navy text-white px-6 py-3 rounded font-black hover:bg-orange transition-colors flex items-center gap-2"
                >
                    <Gavel size={18} /> BID
                </button>
            </div>
            {isWinning && (
                <div className="bg-green-100 text-green-700 p-2 rounded text-center text-xs font-black uppercase tracking-widest">
                    ✓ You are the lead bidder
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BiddingLotCard;
