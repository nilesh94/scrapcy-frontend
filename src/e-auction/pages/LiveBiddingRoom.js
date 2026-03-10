import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gavel, Clock, Users, Shield, AlertCircle, Zap } from 'lucide-react';
import { auctionAPI } from '../../services/eAuctionAPI';
import BiddingLotCard from '../components/BiddingLotCard';

const LiveBiddingRoom = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  // SaaS Standard: Start with a null or placeholder until offset is calibrated
  const [serverTime, setServerTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);

  // --- REAL-TIME CLOCK SYNC ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // SaaS Standard: Apply calculated offset to local clock to get Virtual Server Time
      setServerTime(new Date(now.getTime() + timeOffset));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeOffset]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Verify payment status and auction state before allowing entry
        const summary = await auctionAPI.getParticipationSummary(auctionId);
        
        if (summary.participation?.payment_status !== 'SUCCESS' || summary.auction?.status !== 'LIVE') {
           alert("Access Denied: You must complete EMD payment and the auction must be LIVE to enter.");
           window.location.href = `/e-auction/auction/${auctionId}/participation`;
           return;
        }

        // --- CLOCK DRIFT CALCULATION ---
        if (summary.server_time) {
          // Parse server time as UTC explicitly to prevent browser local-shift
          const backendTime = new Date(summary.server_time).getTime();
          const localTime = new Date().getTime();
          const calculatedOffset = backendTime - localTime;
          
          setTimeOffset(calculatedOffset);
          // SaaS Standard: Update serverTime immediately to prevent "Locked" first render
          setServerTime(new Date(localTime + calculatedOffset));
        }

        setAuction(summary.auction);
        setLots(summary.auction.items || []); 
      } catch (err) {
        console.error("Failed to load live auction", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [auctionId]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="text-center">
        <Zap className="w-12 h-12 text-orange animate-bounce mx-auto mb-4" />
        <div className="font-black text-white tracking-[0.2em] uppercase">Initializing Bidding Engine...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200">
      {/* HIGH-INTENSITY HEADER */}
      <div className="bg-[#111827] border-b border-white/5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute inset-0" />
              <div className="w-4 h-4 bg-green-500 rounded-full relative shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-black uppercase tracking-tight leading-none">
                {auction?.auction_title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-orange/10 text-orange text-[10px] font-black px-2 py-0.5 rounded border border-orange/20 uppercase tracking-widest">Live Room</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">ID: #{auctionId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Lots</p>
                <p className="text-white font-black text-xl">{lots.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Type</p>
                <p className="text-white font-black text-xl">{auction?.auction_type}</p>
              </div>
            </div>

            <div className="bg-white/5 px-6 py-2 rounded-lg border border-white/10 flex items-center gap-4 shadow-inner">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 font-black uppercase block leading-none mb-1">Current Server Time (UTC)</span>
                <span className="text-orange font-mono font-black text-2xl tracking-tighter">
                  {/* SaaS Standard: Safety check added to prevent toISOString crash */}
                  {serverTime?.toISOString ? serverTime.toISOString().split('T')[1].split('.')[0] : "SYNCING..."}
                </span>
              </div>
              <Clock className="text-orange/50 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BIDDING GRID */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {lots.map((lot) => (
            <BiddingLotCard 
              key={lot.id} 
              lot={lot} 
              auctionId={auctionId} 
              serverTime={serverTime}
            />
          ))}
        </div>
      </div>

      {/* EMERGENCY FOOTER BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-red-600/10 backdrop-blur-md border-t border-red-600/20 py-2 px-4 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] font-black uppercase text-red-500 tracking-widest">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <span>Secure Encrypted Bidding Session Active</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield size={12}/> Verified Participation Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingRoom;
