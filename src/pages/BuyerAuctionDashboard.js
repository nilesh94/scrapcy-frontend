import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, PlayCircle, Clock, FileText } from 'lucide-react';
import { auctionAPI } from '../../services/eAuctionAPI';
import BiddingLotCard from '../e-auction/components/BiddingLotCard';

const BuyerAuctionDashboard = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        // Fetch specific participation status for this user + auction details
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

  if (loading) return <div className="p-20 text-center font-black">VERIFYING CREDENTIALS...</div>;

  const hasPaidEMD = data?.participation?.payment_status === 'SUCCESS';
  const isAuctionLive = data?.auction?.status === 'LIVE';
  const isEligible = hasPaidEMD && isAuctionLive;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Auction Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border-l-8 border-navy">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Auction Event</span>
              <h1 className="text-3xl font-black text-navy mt-1">{data?.auction?.auction_title}</h1>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
              data?.auction?.status === 'LIVE' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-200 text-gray-600'
            }`}>
              {data?.auction?.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Eligibility Checklist */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-black text-navy uppercase text-sm mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-navy" /> Participation Requirements
            </h3>
            
            <div className="space-y-4">
              <RequirementItem 
                label="Auction Registration" 
                isDone={true} 
                desc="Profile verified for e-auction"
              />
              <RequirementItem 
                label="EMD / Participation Fee" 
                isDone={hasPaidEMD} 
                desc={`Amount: ₹${data?.auction?.emd_amount?.toLocaleString()}`}
              />
              <RequirementItem 
                label="Document Verification" 
                isDone={true} 
                desc="T&C accepted and signed"
              />
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-navy rounded-xl shadow-2xl p-8 text-white flex flex-col justify-center items-center text-center">
            {isEligible ? (
              <>
                <PlayCircle size={64} className="text-orange mb-4 animate-bounce" />
                <h2 className="text-2xl font-black mb-2 uppercase italic">Battle Station Ready</h2>
                <p className="text-gray-400 text-sm mb-6">You are a verified participant. All lots are open for simultaneous bidding below.</p>
                <div className="text-xs font-bold bg-white/10 p-2 rounded text-orange uppercase tracking-widest">
                  Live Connection Established
                </div>
              </>
            ) : (
              <>
                <Lock size={64} className="text-gray-500 mb-4" />
                <h2 className="text-2xl font-black mb-2 uppercase italic">Bidding Locked</h2>
                <p className="text-gray-400 text-sm mb-6">
                  {!isAuctionLive 
                    ? `Auction is currently ${data?.auction?.status}. Please wait for the scheduled start.`
                    : "Please complete EMD payment to unlock bidding access."}
                </p>
                {!hasPaidEMD && (
                  <button className="w-full bg-white text-navy font-black py-4 rounded-lg">
                    PAY EMD NOW
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {isEligible && data?.auction?.items && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b-4 border-navy pb-2 mb-6">
              <FileText className="text-orange" />
              <h2 className="text-2xl font-black text-navy uppercase">Live Bidding Console</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.auction.items.map((lot) => (
                <BiddingLotCard key={lot.id} lot={lot} auctionId={auctionId} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RequirementItem = ({ label, isDone, desc }) => (
  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${isDone ? 'bg-green-500' : 'bg-gray-200'}`}>
      {isDone && <span className="text-white text-[10px]">✓</span>}
    </div>
    <div>
      <p className={`font-bold text-sm ${isDone ? 'text-navy' : 'text-gray-400'}`}>{label}</p>
      <p className="text-[10px] text-gray-500 uppercase">{desc}</p>
    </div>
  </div>
);

export default BuyerAuctionDashboard;
