import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="w-full relative z-50">
      {/* 1. Top Bar */}
      <div className="bg-navy py-3 text-white/70 text-[11px] font-bold hidden lg:block border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center tracking-[0.15em] uppercase">
          <div className="flex space-x-10">
            <span className="flex items-center hover:text-white transition cursor-pointer">
              <svg className="w-4 h-4 mr-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              emergency@mediconnect.com
            </span>
            <span className="flex items-center hover:text-white transition cursor-pointer">
              <svg className="w-4 h-4 mr-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +234 812 345 6789
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-6 border-r border-white/10 pr-6 mr-6">
              <a href="#" className="hover:text-[#1877F2] transition"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="#" className="hover:text-white transition"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>
              <a href="#" className="hover:text-[#0A66C2] transition"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.774-.772 1.774-1.729V1.729C24 .774 23.204 0 22.225 0z"/></svg></a>
            </div>
            <Link to="/about" className="hover:text-white transition">SUPPORT</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <nav className="bg-white py-5 shadow-sm">
        <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center">
          {/* Custom Medical Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition duration-500">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  <path d="M3 12h3l2-4 4 8 2-4h3" opacity="0.5" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-navy rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter text-navy uppercase leading-none">
                Medi<span className="text-primary">Connect</span>
              </span>
              <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase mt-1">Health Platform</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-12 text-[13px] font-bold text-navy uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Home</Link>
            <Link to="/about" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">About</Link>
            <Link to="/specialists" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1">Specialists</Link>
            
            <div className="flex items-center space-x-8 pl-8 border-l border-slate-100 ml-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-primary hover:text-navy transition font-black">
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-navy transition text-[11px] cursor-pointer">LOGOUT</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-primary transition">Login</Link>
                  <Link to="/register" className="btn-medcare-primary">
                    Join Us
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-navy p-2 hover:bg-slate-50 rounded-lg transition"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-navy z-[100] p-8 flex flex-col text-white">
          <div className="flex justify-between items-center mb-12">
             <div className="text-xl font-bold italic">MEDICONNECT</div>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border border-white/20 rounded-full">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
          </div>
          <div className="flex flex-col space-y-8 text-2xl font-bold uppercase tracking-widest">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/specialists" onClick={() => setIsMobileMenuOpen(false)}>Specialists</Link>
            <div className="pt-8 border-t border-white/10 flex flex-col space-y-6">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-left text-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-primary">Join Us</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
