import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // Force refresh to update Navbar
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side: Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative items-center justify-center p-20">
         <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary blur-[120px] rounded-full"></div>
         </div>
         <div className="relative z-10 max-w-lg">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white shadow-2xl mb-10">
               <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
            </div>
            <h1 className="text-6xl font-serif font-black text-white leading-tight mb-8">
               Your Health,<br/><span className="text-primary italic">Our Priority.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-[1.8] mb-12">
               Access world-class medical specialists from the comfort of your home. Secure, verified, and professional healthcare at your fingertips.
            </p>
            <div className="flex items-center space-x-12">
               <div>
                  <div className="text-3xl font-black text-white">36+</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Specialists</div>
               </div>
               <div>
                  <div className="text-3xl font-black text-white">24/7</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Availability</div>
               </div>
            </div>
         </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-medical">
        <div className="max-w-md w-full card-medcare p-10 lg:p-16 bg-white shadow-2xl">
           <div className="mb-12">
             <h5 className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4">Portal Access</h5>
             <h2 className="text-4xl font-serif font-black text-navy leading-tight">Welcome Back</h2>
             <p className="text-slate-500 mt-4 font-medium">Please enter your credentials to access your portal.</p>
           </div>

           <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Email Address</label>
                 <input
                   type="email"
                   required
                   className="w-full px-6 py-5 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-medium placeholder:text-slate-300 transition duration-300 shadow-sm"
                   placeholder="e.g. john@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Password</label>
                    <a href="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</a>
                 </div>
                 <input
                   type="password"
                   required
                   className="w-full px-6 py-5 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-medium placeholder:text-slate-300 transition duration-300 shadow-sm"
                   placeholder="Your password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
              </div>

              <div className="pt-4">
                 <button
                   type="submit"
                   className="w-full bg-navy py-5 font-black uppercase text-xs tracking-[0.2em] text-white shadow-xl hover:bg-primary transition duration-500 rounded-sm"
                 >
                   Sign In to Portal ⟶
                 </button>
              </div>
           </form>

           <div className="mt-12 text-center pt-8 border-t border-slate-100">
             <p className="text-sm font-medium text-slate-500">
               New to MediConnect? <Link to="/register" className="text-primary font-black uppercase tracking-widest text-[11px] ml-2 hover:underline">Register Now</Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
