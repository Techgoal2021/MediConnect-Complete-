import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing, ${email}! You'll receive our medical updates soon.`);
    setEmail("");
  };

  return (
    <footer className="bg-navy pt-24 pb-12 text-white overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        
        {/* About Column */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Medi<span className="text-primary">Connect</span>
            </span>
          </div>
          <p className="text-slate-400 text-[13px] leading-[1.8] font-medium">
            Bridging the gap between world-class medical specialists and patients worldwide. Making healthcare accessible, verified, and seamless.
          </p>
          <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-[#1877F2] hover:bg-[#1877F2]/10 border border-white/5 hover:border-[#1877F2]/30 transition duration-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-black border border-white/5 hover:border-black transition duration-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 border border-white/5 hover:border-[#0A66C2]/30 transition duration-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.774-.772 1.774-1.729V1.729C24 .774 23.204 0 22.225 0z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-[#E4405F] hover:bg-[#E4405F]/10 border border-white/5 hover:border-[#E4405F]/30 transition duration-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308 1.14 1.14 1.418 2.385 1.48 3.507.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.33 2.633-1.308 3.608-1.14 1.14-2.384 1.418-3.506 1.48-1.267.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-1.14-1.14-1.418-2.385-1.48-3.507-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.33-2.633 1.308-3.608 1.14-1.14 2.385-1.418 3.507-1.48 1.265-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-primary">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/specialists" className="hover:text-white transition">Our Specialists</Link></li>
            <li><Link to="/departments" className="hover:text-white transition">Departments</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Portal Login</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-primary">Specializations</h4>
          <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            <li><Link to="/specialists?specialization=General Medicine" className="hover:text-white transition">Family Medicine</Link></li>
            <li><Link to="/specialists?specialization=Cardiology" className="hover:text-white transition">Heart Surgery</Link></li>
            <li><Link to="/specialists?specialization=Neurology" className="hover:text-white transition">Neurology</Link></li>
            <li><Link to="/specialists?specialization=Pediatrics" className="hover:text-white transition">Child Care</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-primary">Newsletter</h4>
          <p className="text-slate-400 text-[13px] mb-6 leading-relaxed font-medium">Join our health network to receive latest updates and clinical insights.</p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <input 
              type="email" 
              required
              placeholder="Your Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 px-5 py-4 rounded-sm w-full focus:ring-1 focus:ring-primary text-sm outline-none placeholder:text-white/20"
            />
            <button type="submit" className="w-full bg-primary py-4 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-navy transition duration-300">
              Subscribe Now
            </button>
          </form>
        </div>

      </div>

      <div className="container mx-auto px-6 lg:px-20 border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
        <div>© 2026 MediConnect. Built for Enyata-Interswitch Buildathon.</div>
        <div className="flex space-x-8 mt-4 md:mt-0">
           <a href="#" className="hover:text-white transition">Privacy Policy</a>
           <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
    </footer>
  );
};

export default Footer;
