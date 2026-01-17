
import React, { useState, useEffect } from 'react';
import { UserProfile, Opportunity } from '../types';
import { fetchOpportunities } from '../services/geminiService';

interface OpportunitiesViewProps {
  profile: UserProfile;
}

const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ profile }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await fetchOpportunities(profile.sector);
      setOpportunities(data);
      setIsLoading(false);
    };
    load();
  }, [profile.sector]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Industry Pulse</div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Market Portal</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">Real-time internships, openings, and trends curated specifically for the <span className="text-indigo-600 font-black">{profile.sector}</span> landscape.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Search Active</span>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opt, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col hover:-translate-y-2 transition-transform group">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  opt.type === 'Internship' ? 'bg-blue-100 text-blue-600' : 
                  opt.type === 'Job' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {opt.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{opt.organization}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{opt.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">{opt.description}</p>
              <a 
                href={opt.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                View Source
              </a>
            </div>
          ))}
          {opportunities.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold">
              No recent signals detected for this sector. Try again later.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesView;
