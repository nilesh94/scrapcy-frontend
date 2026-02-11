import React from 'react';
import { Anchor, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 border-t-8 border-orange mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-orange text-white p-1.5 rounded">
                  <Anchor size={20} className="stroke-[3]" />
               </div>
               <span className="text-2xl font-black uppercase tracking-tighter">Scrapcy</span>
            </div>
            <p className="text-platinum/60 text-sm leading-relaxed">
              India's premium digital marketplace for industrial scrap trading. Verified sellers, secure payments, and transparent logistics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-orange">Platform</h4>
            <ul className="space-y-3 text-sm text-platinum/70">
              <li><a href="#" className="hover:text-white transition">Live Auctions</a></li>
              <li><a href="#" className="hover:text-white transition">Market Rates</a></li>
              <li><a href="#" className="hover:text-white transition">Logistics Partners</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-orange">Legal</h4>
            <ul className="space-y-3 text-sm text-platinum/70">
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Seller Guidelines</a></li>
	      <li><Link to="/terms-and-conditions" className="hover:text-white transition">E-Auction Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-orange">Contact</h4>
            <ul className="space-y-4 text-sm text-platinum/70">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-orange mt-1 shrink-0" />
                <span>HITEC City, Hyderabad,<br/>Telangana 500081</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange shrink-0" />
                <span>+91 86026 58000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange shrink-0" />
                <span>support@scrapcy.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-platinum/40 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Scrapcy Technologies Pvt Ltd.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook size={16}/>} />
            <SocialIcon icon={<Twitter size={16}/>} />
            <SocialIcon icon={<Linkedin size={16}/>} />
            <SocialIcon icon={<Instagram size={16}/>} />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-orange hover:text-white transition-all text-platinum/60">
    {icon}
  </a>
);

export default Footer;
