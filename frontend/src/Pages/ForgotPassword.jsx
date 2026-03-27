import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-medical p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-2xl">
        <h2 className="text-3xl font-serif font-black text-navy mb-4">Password Recovery</h2>
        <p className="text-slate-500 mb-8 font-medium italic">Enter your email and a new password.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-widest">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest">{success}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Email Address</label>
            <input type="email" required className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm" 
              placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-navy uppercase tracking-widest">New Password</label>
            <input type="password" required className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm" 
              placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-navy py-5 font-black uppercase text-xs tracking-widest text-white hover:bg-primary transition rounded-sm shadow-xl">
            Update Password ⟶
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-slate-100">
          <Link to="/login" className="text-primary font-black uppercase tracking-widest text-[11px]">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
