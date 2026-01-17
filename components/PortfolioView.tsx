
import React, { useState, useEffect } from 'react';
import { UserProfile, PortfolioStrategy } from '../types';
import { generatePortfolioStrategy } from '../services/geminiService';

interface PortfolioViewProps {
  profile: UserProfile;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ profile }) => {
  const [strategy, setStrategy] = useState<PortfolioStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await generatePortfolioStrategy(profile);
        setStrategy(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [profile]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center space-y-8 animate-pulse">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-32 w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-16 space-y-6">
        <div className="inline-flex px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Personal Brand Architect</div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Portfolio Builder</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">Smart strategy to position your skills for the <span className="text-blue-600 font-black">{profile.sector}</span> industry.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Brand Identity */}
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-slate-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-6">Identity Tagline</h3>
            <p className="text-3xl font-black tracking-tight leading-tight mb-10">"{strategy?.tagline}"</p>
            <div className="pt-10 border-t border-white/10 dark:border-slate-200/60">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Branding Advice</h4>
               <p className="text-sm font-medium leading-relaxed opacity-80">{strategy?.personalBrandAdvice}</p>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl">
             <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-8">Case Study Blueprints</h3>
             <ul className="space-y-6">
               {strategy?.suggestedCaseStudies.map((study, i) => (
                 <li key={i} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{study}</p>
                 </li>
               ))}
             </ul>
          </section>
        </div>

        {/* Right Column: Structure */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {strategy?.sections.map((section, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl hover:-translate-y-2 transition-transform">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{section.title}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">{section.description}</p>
               <div className="flex flex-wrap gap-2">
                 {section.items.map((item, i) => (
                   <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">{item}</span>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
