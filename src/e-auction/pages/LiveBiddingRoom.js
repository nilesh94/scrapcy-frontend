import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gavel, Clock, Users, Shield, AlertCircle } from 'lucide-react';
import { auctionAPI } from '../../services/eAuctionAPI';
import BiddingLotCard from '../components/BiddingLotCard';

const LiveBiddingRoom = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await auctionAPI.getAuctionDetails(auctionId);
        setAuction(data);
        setLots(data.items || []); // Simultaneous display of all items
      } catch (err) {
        console.error("Failed to load live auction", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [auctionId]);

  if (loading) return <div className="p-10 text-center font-black">INITIALIZING BIDDING ENGINE...</div>;

  return (
    <div className="min-h-screen bg-navy p-4 md:p-8">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            {auction?.auction_title}
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-1">Live Simultaneous Bidding Room • ID: #{auctionId}</p>
        </div>
        <div className="bg-white/5 p-4 rounded border border-white/10 text-right">
            <span className="text-[10px] text-gray-500 font-black uppercase block">Server UTC Time</span>
            <span className="text-orange font-mono font-bold text-lg">{new Date().toISOString().split('T')[1].split('.')[0]}</span>
        </div>
      </div>

      {/* Grid of Lots */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map((lot) => (
          <BiddingLotCard key={lot.id} lot={lot} auctionId={auctionId} />
        ))}
      </div>
    </div>
  );
};

export default LiveBiddingRoom;
