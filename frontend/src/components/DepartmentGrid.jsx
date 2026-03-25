import React from "react";
import { Link } from "react-router-dom";

const departments = [
  { id: "General Medicine", name: "Family Medicine", icon: "🩺", desc: "Comprehensive primary care for all ages and medical concerns." },
  { id: "Cardiology", name: "Heart Surgery", icon: "❤️", desc: "Advanced cardiac diagnostics and surgical interventions." },
  { id: "Pediatrics", name: "Child Care", icon: "👶", desc: "Expert medical support for growth and development." },
  { id: "Dermatology", name: "Skin Care", icon: "🧴", desc: "Professional treatments for clinical and aesthetic skin health." },
  { id: "Neurology", name: "Neurology", icon: "🧠", desc: "Specialized care for the nervous system and brain health." },
  { id: "Psychiatry", name: "Mental Health", icon: "🤝", desc: "Compassionate support for emotional and psychological well-being." }
];

const DepartmentGrid = ({ title = "Our Medical Services", showHeader = true }) => {
  return (
    <section className="bg-medical py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-20">
        {showHeader && (
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h5 className="text-primary font-black tracking-[0.3em] uppercase mb-4 text-xs">Expertise Areas</h5>
            <h2 className="text-4xl lg:text-5xl font-serif font-black text-navy mb-6 leading-tight">High Performance Services For All <span className="text-primary italic">Department</span></h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div 
              key={dept.id} 
              className="card-medcare p-10 lg:p-12 hover:border-primary group flex flex-col h-full"
            >
              <div className="text-5xl mb-8 transform group-hover:-translate-y-2 transition duration-500 inline-block grayscale group-hover:grayscale-0">
                {dept.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-navy group-hover:text-primary transition tracking-tighter">
                {dept.name}
              </h3>
              <p className="text-slate-500 font-medium leading-[1.8] mb-10 flex-grow">
                {dept.desc}
              </p>
              
              <Link 
                to={`/specialists?specialization=${dept.id}`}
                className="inline-flex items-center text-[13px] font-black text-navy uppercase tracking-widest hover:text-primary group-hover:translate-x-2 transition-all duration-300"
              >
                 Book Consultation <span className="ml-3 text-primary">⟶</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentGrid;
