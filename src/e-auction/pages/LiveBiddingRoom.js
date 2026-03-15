import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gavel, Clock, Users, Shield, AlertCircle, Zap, LogOut, FileText, Map, Tag, Info } from 'lucide-react';
import { auctionAPI } from '../../services/eAuctionAPI';
import BiddingLotCard from '../components/BiddingLotCard';

const LiveBiddingRoom = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverTime, setServerTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);

  // --- EXIT ROOM HANDLER ---
  const handleExitRoom = () => {
    if (window.confirm("Are you sure you want to exit the live bidding room? All active connections will be closed.")) {
      // Navigating away will trigger unmount in all BiddingLotCard components,
      // which already have cleanup logic to close their respective WebSockets.
      navigate(`/dashboard`);
    }
  };

  // --- REAL-TIME CLOCK SYNC ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setServerTime(new Date(now.getTime() + timeOffset));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeOffset]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const summary = await auctionAPI.getParticipationSummary(auctionId);
        
        if (summary.participation?.payment_status !== 'SUCCESS' || summary.auction?.status !== 'LIVE') {
           alert("Access Denied: You must complete EMD payment and the auction must be LIVE to enter.");
           window.location.href = `/e-auction/auction/${auctionId}/participation`;
           return;
        }

        // --- CLOCK DRIFT CALCULATION ---
        if (summary.server_time) {
          const backendTime = new Date(summary.server_time).getTime();
          const localTime = new Date().getTime();
          const calculatedOffset = backendTime - localTime;
          
          setTimeOffset(calculatedOffset);
          setServerTime(new Date(localTime + calculatedOffset));
        }

        setAuction(summary.auction);
        setLots(summary.auction.items || []); 

        // Derive the current participant/user id from summary (backend contract)
        const derivedUserId =
          summary.participation?.user_id ??
          summary.participation?.buyer_id ??
          summary.user?.id ??
          summary.current_user_id;
        if (derivedUserId) {
          console.debug("LiveBiddingRoom: derived user id", derivedUserId);
          setCurrentUserId(Number(derivedUserId));
        }
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
      {/* --- INDUSTRY STANDARD: COMMAND CENTER HEADER --- */}
      <div className="bg-[#111827] border-b border-white/5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute inset-0" />
              <div className="w-4 h-4 bg-green-500 rounded-full relative shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-white text-xl font-black uppercase tracking-tight leading-none">
                  {auction?.auction_title}
                </h1>
                <button 
                  onClick={() => setShowAuctionDetails(!showAuctionDetails)}
                  className="bg-white/5 hover:bg-white/10 p-1.5 rounded transition-colors"
                >
                  <Info size={14} className="text-slate-400" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="bg-orange/10 text-orange text-[9px] font-black px-1.5 py-0.5 rounded border border-orange/20 uppercase tracking-widest">Live Console</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">AUCTION ID: #{auctionId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
              <div className="text-center">
                <p className="text-[9px] text-slate-500 font-black uppercase mb-0.5">Total Lots</p>
                <p className="text-white font-black text-lg">{lots.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-slate-500 font-black uppercase mb-0.5">Auction Type</p>
                <p className="text-white font-black text-lg uppercase">{auction?.auction_type}</p>
              </div>
            </div>

            <div className="bg-white/5 px-4 py-1.5 rounded-lg border border-white/10 flex items-center gap-3 shadow-inner">
              <div className="text-right">
                <span className="text-[8px] text-slate-500 font-black uppercase block leading-none mb-0.5">Server Time (UTC)</span>
                <span className="text-orange font-mono font-black text-xl tracking-tighter">
                  {serverTime?.toISOString ? serverTime.toISOString().split('T')[1].split('.')[0] : "SYNCING..."}
                </span>
              </div>
              <Clock className="text-orange/50 w-4 h-4" />
            </div>

            <button 
              onClick={handleExitRoom}
              className="group flex items-center gap-3 bg-red-600/10 hover:bg-red-600 border border-red-600/20 hover:border-red-600 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <div className="text-right hidden sm:block">
                <span className="text-[8px] text-red-500 group-hover:text-white font-black uppercase block leading-none mb-0.5">Safety First</span>
                <span className="text-red-500 group-hover:text-white font-black text-[10px] uppercase tracking-widest">Exit Room</span>
              </div>
              <LogOut className="text-red-500 group-hover:text-white w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- AUCTION DETAILS OVERLAY --- */}
      {showAuctionDetails && (
        <div className="bg-[#111827] border-b border-white/5 p-4 animate-in slide-in-from-top duration-300">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
             <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1.5">
                   <Map size={10} /> Region
                </span>
                <p className="text-white text-xs font-bold">{auction?.region || 'Not Specified'}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1.5">
                   <Tag size={10} /> Category
                </span>
                <p className="text-white text-xs font-bold">{auction?.category || 'General Scrap'}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1.5">
                   <Shield size={10} /> EMD Status
                </span>
                <p className="text-green-500 text-xs font-bold">VERIFIED & PAID</p>
             </div>
             <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1.5">
                   <FileText size={10} /> Terms & Docs
                </span>
                <a href="#" className="text-orange hover:underline text-xs font-bold block">View Auction Terms</a>
             </div>
             <div className="lg:col-span-2 space-y-1">
                <span className="text-[9px] text-slate-500 font-black uppercase flex items-center gap-1.5">
                   <Users size={10} /> Room Status
                </span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <p className="text-slate-300 text-xs font-bold">Multiple Verified Bidders Active</p>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* --- INDUSTRY STANDARD: LOTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {lots.map((lot) => (
            <BiddingLotCard 
              key={lot.id} 
              lot={lot}
              auctionId={auctionId}
              currentUserId={currentUserId}
              serverTime={serverTime}
            />
          ))}
        </div>
      </div>

      {/* --- INDUSTRY STANDARD: BOTTOM STATUS BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B1120]/80 backdrop-blur-md border-t border-white/5 py-2 px-4 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-green-500">
              <Shield size={12} />
              <span>Secure Session</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <AlertCircle size={12} />
              <span>Verified Participation Only</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 Scrapcy Bidding Engine v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingRoom;
