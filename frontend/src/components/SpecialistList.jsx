import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

import DepartmentGrid from "./DepartmentGrid";

const SpecialistList = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterBy = queryParams.get("specialization");

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/specialists`);
        let data = await res.json();
        
        if (filterBy && filterBy !== "all") {
          data = data.filter(s => s.specialization.toLowerCase().trim() === filterBy.toLowerCase().trim());
        }
        
        setSpecialists(data);
      } catch (err) {
        console.error("Error fetching specialists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialists();
  }, [filterBy]);

  if (loading) return (
    <div className="flex justify-center items-center py-40">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // If no specialization selected, show the Department Grid as the entrance
  if (!filterBy) {
    return (
      <div className="pt-20">
        <DepartmentGrid title="Select a Department" showHeader={true} />
        {/* Optional: Add a "Browse All Specialists" link below the grid */}
        <div className="container mx-auto px-6 lg:px-20 pb-24 text-center">
           <Link to="/specialists?specialization=all" className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition border-b border-slate-200 pb-2">Or Browse All Verified Experts ⟶</Link>
        </div>
      </div>
    );
  }

  // Handle "Browse All" edge case
  const displayedSpecialists = filterBy === "all" ? specialists.slice(0, 12) : specialists;

  return (
    <section className="py-24 lg:py-32 bg-medical">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-16 lg:mb-24 max-w-2xl mx-auto">
          <h5 className="text-primary font-black tracking-[0.4em] uppercase mb-4 text-xs">Medical Specialists</h5>
          <h2 className="text-4xl lg:text-5xl font-serif font-black text-navy mb-6 leading-tight">
            {filterBy === "all" ? <>Our Global <span className="text-primary italic">Expert Network</span></> : <>{filterBy} <span className="text-primary italic">Specialists</span></>}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-slate-500 font-medium">Verified professional medical practitioners available for instant consultation via Interswitch WebPay.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedSpecialists.map((s) => (
            <div key={s.id} className="card-medcare group hover:border-primary flex flex-col">
              {/* Profile Top */}
              <div className="p-10 pb-0 text-center flex flex-col items-center">
                 <div className="w-28 h-28 bg-medical rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl relative overflow-hidden group-hover:scale-105 transition duration-500">
                    <svg className="w-16 h-16 text-slate-200 group-hover:text-primary/20 transition duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    {/* Badge */}
                    <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                 </div>
                 <Link to={`/specialist/${s.id}`} className="text-2xl font-black text-navy hover:text-primary transition tracking-tighter mb-2 block">
                   {s.user?.name}
                 </Link>
                 <span className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-6 block bg-primary/5 px-4 py-1 rounded-full">{s.specialization}</span>
              </div>

              {/* Bio */}
              <div className="px-10 pb-10 flex-grow">
                 <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3 italic">
                   "{s.bio}"
                 </p>
                 <div className="flex flex-col space-y-4 pt-8 border-t border-slate-50">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                       <span className="text-slate-400">Consultation Fee</span>
                       <span className="text-navy">₦{s.consultationFee.toLocaleString()}</span>
                    </div>
                    <Link 
                      to={`/specialist/${s.id}`} 
                      className="btn-medcare-outline inline-block text-center w-full py-4"
                    >
                      Book Session ⟶
                    </Link>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {displayedSpecialists.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
             <p className="text-slate-400 font-serif text-xl font-bold">No specialists found in this department yet.</p>
             <Link to="/specialists" className="text-primary font-black uppercase tracking-widest text-xs mt-4 inline-block underline underline-offset-8">Return to Departments</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialistList;
