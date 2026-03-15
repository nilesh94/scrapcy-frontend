import React, { useState, useEffect, useRef } from 'react';
import { Gavel, Clock, TrendingUp, Shield, Trophy } from 'lucide-react';
import { auctionAPI, getLotBiddingWebSocketUrl } from '../../services/eAuctionAPI';

const BiddingLotCard = ({ lot, auctionId, serverTime, currentUserId }) => {
  // SaaS Standard: Ensure state values are initialized as numbers to prevent concatenation
  const [currentPrice, setCurrentPrice] = useState(Number(lot.highest_bid_amount || lot.starting_bid_amount));
  const [isWinning, setIsWinning] = useState(false);
  const [ws, setWs] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [lotEndTime, setLotEndTime] = useState(lot.lot_end_time);
  const [timeLeft, setTimeLeft] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [priceFlash, setPriceFlash] = useState(false);
  // SaaS Standard: Keep track of the current increment for UI calculation as a Number
  const [minIncrement, setMinIncrement] = useState(Number(lot.min_increment_amount || 0));
  // Initialize lastUserBid from server-provided value when available
  const initialLastBid =
    lot.last_user_bid_amount != null
      ? Number(lot.last_user_bid_amount)
      : lot.user_last_bid_amount != null
        ? Number(lot.user_last_bid_amount)
        : null;
  const [lastUserBid, setLastUserBid] = useState(initialLastBid);
  
  const prevPriceRef = useRef(currentPrice);
  const lastUserBidRef = useRef(initialLastBid);

  useEffect(() => {
    lastUserBidRef.current = lastUserBid;
  }, [lastUserBid]);

  useEffect(() => {
    // Prefer user id from LiveBiddingRoom summary; fallback to localStorage
    let effectiveUserId = currentUserId ? Number(currentUserId) : null;
    if (!effectiveUserId) {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.warn("BiddingLotCard: missing current user id for lot", lot.id);
        return;
      }
      try {
        const user = JSON.parse(userString);
        if (!user || !user.id) {
          console.warn("BiddingLotCard: invalid user object in localStorage for lot", lot.id);
          return;
        }
        effectiveUserId = Number(user.id);
      } catch (e) {
        console.warn("BiddingLotCard: failed to parse localStorage user", e);
        return;
      }
    }

    const userId = effectiveUserId;
    const token = localStorage.getItem('token');
    let retryCount = 0;
    const maxRetries = 5;
    let socket;
    let heartbeatInterval;

    const connectWS = () => {
      // Initialize winning state from lot data if backend provided it
      const initialWinningUserId =
        lot.winning_user_id ??
        lot.highest_bidder_user_id ??
        lot.bidder_user_id ??
        lot.current_winner_user_id;
      if (initialWinningUserId !== undefined && initialWinningUserId !== null) {
        setIsWinning(Number(initialWinningUserId) === userId);
      } else if (
        initialLastBid != null &&
        Number(initialLastBid) === Number(lot.highest_bid_amount || lot.starting_bid_amount)
      ) {
        setIsWinning(true);
      }

      // Centralized WebSocket URL builder (kept in eAuctionAPI service)
      const socketUrl = getLotBiddingWebSocketUrl(lot.id, userId, token);
      console.debug("Bidding WS connecting", { lotId: lot.id, socketUrl, userId, retry: retryCount });
      
      socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.debug("Bidding WS open", { lotId: lot.id });
        retryCount = 0; // Reset on successful connection
        
        // SaaS Standard: Keep connection alive with a simple heartbeat string
        heartbeatInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send("ping");
          }
        }, 30000); // Send every 30 seconds
      };

      socket.onmessage = (event) => {
        if (event.data === "pong") return; // Ignore pong responses
        
        try {
          const data = JSON.parse(event.data);
          console.debug("Bidding WS message", { lotId: lot.id, data });
          handleWsMessage(data);
        } catch (e) {
          console.warn("Bidding WS: Failed to parse message", event.data);
        }
      };

      socket.onerror = (err) => {
        console.error("Bidding WS error", { lotId: lot.id, err });
      };

      socket.onclose = (evt) => {
        console.debug("Bidding WS closed", { 
          lotId: lot.id, 
          code: evt.code, 
          reason: evt.reason,
          wasClean: evt.wasClean
        });
        
        if (heartbeatInterval) clearInterval(heartbeatInterval);

        // SaaS Standard: Handle specific business-logic closure reasons from backend
        if (evt.reason && evt.reason.includes("EMD Payment required")) {
          alert("EMD Payment Required: You must complete registration to bid on this lot.");
          window.location.href = `/e-auction/auction/${auctionId}/participation`;
          return;
        }

        // Auto-retry logic for unexpected closures
        if (retryCount < maxRetries && !evt.wasClean) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
          console.debug(`Bidding WS retrying in ${delay}ms...`, { lotId: lot.id });
          setTimeout(connectWS, delay);
          retryCount++;
        }
      };
      
      setWs(socket);
    };

    const handleWsMessage = (data) => {
      // Handle price / winner updates for any event type
      const rawPrice =
        data.current_highest_bid ??
        data.highest_bid ??
        data.current_price ??
        data.current_bid ??
        data.bid_amount;
      const newPrice = Number(rawPrice);

      if (!Number.isNaN(newPrice)) {
        if (newPrice !== prevPriceRef.current) {
          setPriceFlash(true);
          setTimeout(() => setPriceFlash(false), 1000);
        }

        setCurrentPrice(newPrice);
        prevPriceRef.current = newPrice;
      }

      // Update leading status if user ID matches winner in broadcast
      const winningUserId =
        data.bidder_user_id ??
        data.winning_user_id ??
        data.highest_bidder_user_id ??
        data.current_winner_user_id;
      if (winningUserId !== undefined && winningUserId !== null) {
        const isUserWinning = Number(winningUserId) === userId;
        setIsWinning(isUserWinning);

        // Track the last bid amount placed by this user (from broadcast)
        if (isUserWinning && rawPrice !== undefined && rawPrice !== null) {
          const winnerBid = Number(rawPrice);
          if (!Number.isNaN(winnerBid)) {
            setLastUserBid(winnerBid);
          }
        }
      } else if (!Number.isNaN(newPrice) && lastUserBidRef.current != null) {
        // Fallback: derive winning state from amounts if backend doesn't send winner id
        setIsWinning(Number(lastUserBidRef.current) === newPrice);
      } else if (typeof data.is_winning === "boolean") {
        setIsWinning(data.is_winning);
      }

      if (data.lot_end_time) {
        setLotEndTime(data.lot_end_time);
      }

      if (data.event_type === 'AUCTION_CLOSED') {
        setTimeLeft("CLOSED");
      }
    };

    connectWS();

    return () => {
      if (socket) socket.close();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [lot.id]);

  useEffect(() => {
    // SaaS Standard: Added safety check for serverTime to prevent .getTime() crash
    if (!lotEndTime || timeLeft === "CLOSED" || !serverTime || !serverTime.getTime) return;

    const timer = setInterval(() => {
      // SaaS Standard: Calculate diff using server-synchronized time
      const now = serverTime.getTime();
      const end = new Date(lotEndTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("CLOSED");
        setIsCritical(false);
        clearInterval(timer);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        setIsCritical(diff < 60000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lotEndTime, timeLeft, serverTime]);

  // --- REAL-TIME BIDDING HANDLER ---
  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    // UI Calculation: Highest Bid + Increment (Casting to Number to avoid string concatenation)
    const minRequired = Number(currentPrice) + Number(minIncrement);

    // SaaS Standard: Safety check for serverTime initialization before placing bid
    if (!serverTime || !serverTime.toISOString) {
      alert("Synchronizing with server... please try again in a moment.");
      return;
    }

    if (!bidAmount || amount < minRequired) {
      alert(`Minimum bid required: ₹${minRequired.toLocaleString()}`);
      return;
    }

    try {
      const payload = {
        lot_id: lot.id,
        bid_amount: amount,
        // SaaS Standard: Pass the synchronized timestamp to the API
        client_timestamp: serverTime.toISOString()
      };
      
      const response = await auctionAPI.placeBid(payload);

      // Optimistically remember this user's last successful bid for this lot
      setLastUserBid(amount);
      
      // Update local state immediately with new increment if provided in response
      if (response.data && response.data.min_increment_amount) {
          setMinIncrement(Number(response.data.min_increment_amount));
      }
      
      setBidAmount("");
    } catch (err) {
      console.error("Bidding failed:", err);
      alert(err.response?.data?.detail || "Failed to place bid.");
    }
  };

  const statusColor = timeLeft === "CLOSED" ? 'bg-slate-800' : isWinning ? 'bg-green-600' : 'bg-navy';

  return (
    <div className={`bg-[#111827] rounded-xl shadow-2xl overflow-hidden border border-white/5 transition-all duration-500 ${isWinning && timeLeft !== "CLOSED" ? 'ring-2 ring-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : ''}`}>
      <div className={`p-4 border-b border-white/5 flex justify-between items-center ${isCritical ? 'bg-red-950/30 animate-pulse' : 'bg-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-black text-white text-xs tracking-widest uppercase">Lot #{lot.lot_number}</span>
          {isWinning && timeLeft !== "CLOSED" && <Trophy size={14} className="text-yellow-500" />}
        </div>
        <div className={`flex items-center gap-1.5 font-mono font-black text-sm ${timeLeft === "CLOSED" ? 'text-slate-500' : isCritical ? 'text-red-500' : 'text-orange'}`}>
            <Clock size={16} className={isCritical ? 'animate-spin-slow' : ''} /> {timeLeft || "SYNCING..."}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-white font-bold truncate mb-5 tracking-tight">{lot.item_name}</h3>
        
        <div className={`${statusColor} ${priceFlash ? 'scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]' : ''} p-6 rounded-xl mb-6 text-center transition-all duration-300 relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <TrendingUp className="w-32 h-32 -rotate-12 -ml-10 -mt-10" />
            </div>
            
            <span className="text-[10px] uppercase font-black text-white/50 block mb-2 tracking-[0.2em]">
              {timeLeft === "CLOSED" ? "FINAL SOLD PRICE" : isWinning ? "YOU ARE LEADING" : "CURRENT HIGHEST BID"}
            </span>
            <span className={`text-4xl font-black text-white tracking-tighter transition-opacity ${priceFlash ? 'opacity-50' : 'opacity-100'}`}>
              ₹{Number(currentPrice).toLocaleString()}
            </span>
        </div>

        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      // UI uses Increment to show min required value (Explicitly casting both to Number)
                      placeholder={`Min: ${(Number(currentPrice) + Number(minIncrement)).toLocaleString()}`}
                      className="w-full pl-7 p-3.5 bg-white/5 border border-white/10 rounded-lg text-white font-black outline-none focus:border-orange focus:ring-1 focus:ring-orange transition-all"
                      disabled={timeLeft === "CLOSED"}
                    />
                </div>
                <button 
                  onClick={handlePlaceBid}
                  disabled={timeLeft === "CLOSED"}
                  className={`px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${
                    timeLeft === "CLOSED" 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : isWinning 
                      ? 'bg-green-600 text-white hover:bg-green-500' 
                      : 'bg-orange text-white hover:bg-white hover:text-navy active:scale-95 shadow-lg shadow-orange/20'
                  }`}
                >
                    <Gavel size={18} /> Bid
                </button>
            </div>

            {timeLeft !== "CLOSED" && (
                <div className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isWinning 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                  : 'bg-orange/10 border-orange/20 text-orange'
                }`}>
                    {isWinning ? (
                      <><Shield size={12} /> Your Bid is the Highest</>
                    ) : (
                      <><TrendingUp size={12} /> Outbid! Place a higher bid</>
                    )}
                </div>
            )}
        </div>
        
        {timeLeft !== "CLOSED" && (
          <div className="mt-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
            {lastUserBid ? (
              <>
                {isWinning && <Trophy size={12} className="text-yellow-400" />}
                <span>Your last bid:</span>
                <span className="text-white">₹{Number(lastUserBid).toLocaleString()}</span>
                {isWinning && <span className="text-green-400">(Winning)</span>}
              </>
            ) : (
              "You have not placed a bid yet."
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingLotCard;
