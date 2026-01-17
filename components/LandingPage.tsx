
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-all duration-700 relative overflow-hidden font-sans flex items-center justify-center">
      {/* React Bits Style: Background Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12 py-20">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl animate-in zoom-in duration-1000">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Career Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-700">
            Design Your <br />
            <span className="text-blue-600">Peak Performance.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            The industry is moving faster than ever. Planify analyzes the gaps and builds your technical mastery roadmap in seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <button 
            onClick={onStart}
            className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 hover:shadow-blue-500/40"
          >
            Start Your Journey
          </button>
          
          <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 rounded-3xl">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <img key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 88}`} alt="user" />
               ))}
             </div>
             <div className="text-left">
               <p className="text-[10px] font-black uppercase text-slate-400">Join the Collective</p>
               <p className="text-sm font-bold">1.2k+ Path Generated</p>
             </div>
          </div>
        </div>

        {/* Dynamic Card Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
          {[
            { label: 'Neural Mapping', icon: '🧠', text: 'Real-time skill gap analysis.' },
            { label: 'Market Grounding', icon: '🌐', text: 'Live industry opportunities.' },
            { label: 'AI Mentorship', icon: '👤', text: 'Sector-specific expert advice.' }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4 group hover:-translate-y-2 transition-transform">
              <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-black text-lg tracking-tight">{item.label}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
