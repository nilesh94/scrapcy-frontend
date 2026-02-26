import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Landmark, Mail, MessageSquare, Info, ChevronLeft, Copy, CheckCircle } from 'lucide-react';
import { auctionAPI } from '../services/eAuctionAPI';
import Header from '../components/Header/Header';

const EMDPaymentInstructions = () => {
    const { auctionId } = useParams();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const data = await auctionAPI.getAuctionById(auctionId);
                setAuction(data);
            } catch (err) {
                console.error("Error fetching auction for EMD", err);
            }
        };
        fetchAuction();
    }, [auctionId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="max-w-3xl mx-auto p-6 w-full">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-steel font-bold mb-6 hover:text-navy">
                    <ChevronLeft size={20}/> BACK TO DASHBOARD
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-platinum">
                    <div className="bg-navy p-8 text-white text-center">
                        <h1 className="text-3xl font-black uppercase italic mb-2">EMD Payment Portal</h1>
                        <p className="text-orange font-bold uppercase tracking-widest text-sm">Auction ID: #{auctionId}</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="bg-orange/10 p-6 rounded-xl border-l-4 border-orange">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-orange uppercase">Required Deposit Amount</p>
                                    <p className="text-4xl font-black text-navy">₹{parseFloat(auction?.emd_amount || 0).toLocaleString()}</p>
                                </div>
                                <Info size={32} className="text-orange opacity-50"/>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-black text-navy uppercase text-sm mb-4 flex items-center gap-2">
                                <Landmark size={18} className="text-orange" /> Official Bank Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-platinum/30 p-6 rounded-xl border border-platinum font-mono text-sm">
                                <div><p className="text-gray-500 uppercase text-[10px]">Bank Name</p><p className="font-bold">HDFC BANK LTD</p></div>
                                <div><p className="text-gray-500 uppercase text-[10px]">Account Name</p><p className="font-bold">SCRAPCY PRIVATE LIMITED</p></div>
                                <div><p className="text-gray-500 uppercase text-[10px]">Account Number</p><p className="font-bold flex items-center gap-2">50200012345678 <Copy size={14} className="cursor-pointer hover:text-orange" onClick={() => handleCopy('50200012345678')}/></p></div>
                                <div><p className="text-gray-500 uppercase text-[10px]">IFSC Code</p><p className="font-bold flex items-center gap-2">HDFC0001234 <Copy size={14} className="cursor-pointer hover:text-orange" onClick={() => handleCopy('HDFC0001234')}/></p></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-navy uppercase text-sm mb-2">Next Steps After Deposit:</h3>
                            <p className="text-sm text-gray-600">Please send your <strong>Transaction Reference Number (UTR)</strong> and <strong>Auction ID</strong> to our support team for manual verification.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a href="https://wa.me/91XXXXXXXXXX" className="flex items-center gap-4 p-4 rounded-xl border-2 border-green-100 hover:border-green-500 transition-all bg-green-50/30 group">
                                    <MessageSquare className="text-green-600" />
                                    <div>
                                        <p className="font-black text-navy text-xs uppercase">Send via WhatsApp</p>
                                        <p className="text-xs text-gray-500">+91 12345 67890</p>
                                    </div>
                                </a>
                                <a href="mailto:support@scrapcy.com" className="flex items-center gap-4 p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 transition-all bg-blue-50/30 group">
                                    <Mail className="text-blue-600" />
                                    <div>
                                        <p className="font-black text-navy text-xs uppercase">Send via Email</p>
                                        <p className="text-xs text-gray-500">emd@scrapcy.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-platinum/20 border-t border-platinum text-center">
                        <p className="text-xs text-gray-500 italic mb-4">Once verified by our admin, your "Enter Auction" button will be unlocked automatically.</p>
                        <button onClick={() => navigate('/buyer-dashboard')} className="w-full bg-navy text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange transition-all">
                            I HAVE INITIATED THE PAYMENT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMDPaymentInstructions;
