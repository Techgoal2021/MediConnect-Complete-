import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Aggressive cleanup for demo stand
  React.useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous session first
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side: Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative items-center justify-center p-20">
         <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary blur-[120px] rounded-full"></div>
         </div>
         <div className="relative z-10 max-w-lg">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white shadow-2xl mb-10">
               <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
            </div>
            <h1 className="text-6xl font-serif font-black text-white leading-tight mb-8">
               Join Our<br/><span className="text-primary italic">Health Network.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-[1.8] mb-12">
               Be part of a growing community of medical professionals and patients. Experience healthcare that is verified, secure, and world-class.
            </p>
            <div className="space-y-6">
               <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                     <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                  <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Verified Multi-Specialty Hospital</span>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                     <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                  <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Secure Interswitch Payment Integration</span>
               </div>
            </div>
         </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 bg-medical overflow-y-auto">
        <div className="max-w-md w-full card-medcare p-10 lg:p-16 bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
           <div className="mb-10 text-center lg:text-left">
             <h5 className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4">Registration</h5>
             <h2 className="text-4xl font-serif font-black text-navy leading-tight">Create Account</h2>
             <p className="text-slate-500 mt-4 font-medium">Join MediConnect today. It's fast, secure and verified.</p>
           </div>

           <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition shadow-sm"
                      placeholder="John Doe"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition shadow-sm"
                      placeholder="080 000 0000"
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Email Address</label>
                 <input
                   type="email"
                   required
                   className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition shadow-sm"
                   placeholder="john@example.com"
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Account Role</label>
                 <select
                   className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-black uppercase tracking-widest text-navy transition shadow-sm appearance-none cursor-pointer"
                   onChange={(e) => setFormData({...formData, role: e.target.value})}
                 >
                   <option value="patient">I am a Patient</option>
                   <option value="specialist">I am a Medical Specialist</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Password</label>
                 <input
                   type="password"
                   required
                   className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition shadow-sm"
                   placeholder="Minimum 6 characters"
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                 />
              </div>

              <div className="pt-6">
                 <button
                   type="submit"
                   className="w-full bg-navy py-5 font-black uppercase text-xs tracking-[0.2em] text-white shadow-xl hover:bg-primary transition duration-500 rounded-sm"
                 >
                   Create Secure Account ⟶
                 </button>
              </div>
           </form>

           <div className="mt-10 text-center pt-8 border-t border-slate-100">
             <p className="text-sm font-medium text-slate-500">
               Already have an account? <Link to="/login" className="text-primary font-black uppercase tracking-widest text-[11px] ml-2 hover:underline">Sign In</Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
