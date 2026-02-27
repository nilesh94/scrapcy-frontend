import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, PlayCircle, Clock, FileText, ChevronLeft, Calendar, Info } from 'lucide-react';
import { auctionAPI } from '../services/eAuctionAPI';
import BiddingLotCard from '../e-auction/components/BiddingLotCard';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const BuyerAuctionDashboard = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await auctionAPI.getParticipationSummary(auctionId);
        setData(res);
      } catch (err) {
        console.error("Access denied or auction not found");
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, [auctionId]);

  // Countdown Timer Logic
  useEffect(() => {
    if (data?.auction?.scheduled_start_time) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(data.auction.scheduled_start_time).getTime();
        const diff = start - now;

        if (diff < 0) {
          setTimeLeft('STARTED');
          clearInterval(timer);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data]);

  if (loading) return (
    <div className="min-h-screen bg-platinum flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-navy border-t-orange rounded-full animate-spin mb-4" />
      <p className="font-black text-navy uppercase tracking-widest">Verifying Participation...</p>
    </div>
  );

  const hasPaidEMD = data?.participation?.payment_status === 'SUCCESS';
  const isAuctionLive = data?.auction?.status === 'LIVE';
  const isEligible = hasPaidEMD && isAuctionLive;

  return (
    <div className="min-h-screen bg-platinum flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <div className="bg-navy text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange/10 skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button 
            onClick={() => navigate('/buyer-dashboard')}
            className="flex items-center gap-2 text-steel font-bold text-xs uppercase tracking-widest mb-8 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange text-navy text-[10px] font-black px-2 py-0.5 rounded uppercase">ID: #{auctionId}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  isAuctionLive ? 'bg-green-500 text-white' : 'bg-steel text-navy'
                }`}>
                  {data?.auction?.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                {data?.auction?.auction_title}
              </h1>
            </div>

            {!isAuctionLive && (
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-right min-w-[200px]">
                <p className="text-[10px] font-black text-steel uppercase tracking-widest mb-1">Countdown to Start</p>
                <p className="text-3xl font-mono font-bold text-orange">{timeLeft || '--:--:--'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ELIGIBILITY CARD */}
          <div className="bg-white rounded-2xl shadow-xl border border-platinum overflow-hidden">
            <div className="p-6 border-b border-platinum bg-platinum/30">
              <h3 className="font-black text-navy uppercase text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-orange" /> Participation Checklist
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <RequirementItem 
                label="Auction Registration" 
                isDone={true} 
                desc="Profile verified for e-auction"
              />
              <RequirementItem 
                label="EMD / Participation Fee" 
                isDone={hasPaidEMD} 
                desc={`Amount: ₹${parseFloat(data?.auction?.emd_amount || 0).toLocaleString()}`}
              />
              <RequirementItem 
                label="Identity Verification" 
                isDone={true} 
                desc="KYC Documents approved"
              />
            </div>
          </div>

          {/* ACCESS CARD */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-platinum overflow-hidden flex flex-col">
            <div className="flex-grow p-10 flex flex-col items-center justify-center text-center">
              {isEligible ? (
                <>
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <PlayCircle size={48} className="text-green-600" />
                  </div>
                  <h2 className="text-3xl font-black text-navy uppercase italic mb-2">Battle Station Ready</h2>
                  <p className="text-steel max-w-md mx-auto font-medium">
                    Your credentials have been verified. You may now enter the live bidding arena to compete on all lots.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-platinum rounded-full flex items-center justify-center mb-6">
                    <Lock size={48} className="text-steel" />
                  </div>
                  <h2 className="text-3xl font-black text-navy uppercase italic mb-2">Bidding Locked</h2>
                  <p className="text-steel max-w-md mx-auto font-medium mb-8">
                    {!isAuctionLive 
                      ? `The auction floor is currently closed. Bidding will unlock on ${new Date(data?.auction?.scheduled_start_time).toLocaleString()}.`
                      : "Access restricted. Please complete your EMD payment to unlock the bidding console."}
                  </p>
                  {!hasPaidEMD && (
                    <button 
                      onClick={() => navigate(`/e-auction/auction/${auctionId}/emd-payment`)}
                      className="bg-orange text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-navy hover:shadow-orange/20 transition-all transform hover:-translate-y-1"
                    >
                      PAY EMD NOW
                    </button>
                  )}
                </>
              )}
            </div>
            
            {isEligible && (
              <div className="p-6 bg-navy text-white flex justify-center">
                <button 
                  onClick={() => navigate(`/e-auction/live/${auctionId}`)}
                  className="bg-orange text-white px-10 py-3 rounded font-black uppercase text-sm tracking-widest hover:bg-white hover:text-navy transition-all"
                >
                  Enter Battle Room
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LIVE BIDDING CONSOLE SECTION */}
        {isEligible && data?.auction?.items && (
          <div className="mt-16 animate-fadeIn">
            <div className="flex items-center justify-between border-b-4 border-navy pb-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy rounded-lg text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-navy uppercase leading-tight">Live Console</h2>
                  <p className="text-steel text-xs font-bold uppercase tracking-widest">Simultaneous Multi-Lot Bidding</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-navy font-black text-sm bg-white px-4 py-2 rounded-lg border border-platinum">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                LIVE UPDATES ACTIVE
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.auction.items.map((lot) => (
                <BiddingLotCard key={lot.id} lot={lot} auctionId={auctionId} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const RequirementItem = ({ label, isDone, desc }) => (
  <div className="flex items-start gap-4 group">
    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
      isDone ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-platinum border border-steel/20'
    }`}>
      {isDone ? <span className="text-white text-xs">✓</span> : <span className="text-steel text-[10px] font-black">!</span>}
    </div>
    <div className="border-b border-platinum pb-4 w-full">
      <p className={`font-black text-xs uppercase tracking-wide ${isDone ? 'text-navy' : 'text-steel'}`}>{label}</p>
      <p className="text-[10px] text-steel font-medium mt-0.5">{desc}</p>
    </div>
  </div>
);

export default BuyerAuctionDashboard;
