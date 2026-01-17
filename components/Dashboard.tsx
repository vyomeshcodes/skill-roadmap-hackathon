
import React, { useState } from 'react';
import { UserProfile, SkillGapAnalysis, ViewState } from '../types';
import RoadmapView from './RoadmapView';

interface DashboardProps {
  profile: UserProfile;
  analysis: SkillGapAnalysis | null;
  isLoading: boolean;
  error?: string | null;
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, analysis, isLoading, error, onNavigate }) => {
  // Spotlight effect logic
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Spotlight Header */}
      <div 
        onMouseMove={handleMouseMove}
        className="group relative bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-12 items-center overflow-hidden transition-all duration-500"
      >
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.06), transparent 40%)`,
          }}
        />
        
        <div className="flex-1 flex flex-col md:flex-row items-center gap-12 z-10 w-full text-center md:text-left">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 animate-pulse"></div>
            <div className="w-32 h-32 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-5xl font-black shadow-2xl relative">
              {profile.name[0].toUpperCase()}
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{profile.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{profile.sector}</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">{profile.level}</span>
              </div>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic border-l-2 border-blue-600/30 pl-4">
              "{profile.goal}"
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-[350px] bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2.5rem] space-y-6 border border-slate-100 dark:border-slate-700/50 z-10">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Level</h3>
            <span className="text-4xl font-black text-blue-600">{analysis?.readinessScore || 0}%</span>
          </div>
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-1">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-[2000ms]"
              style={{ width: `${analysis?.readinessScore || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="min-h-[600px] bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-20 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
               <div className="relative mb-8">
                 <div className="w-20 h-20 border-[8px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
               </div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Synthesizing Your Future</h2>
               <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Processing market signals for {profile.sector}...</p>
            </div>
          ) : error ? (
            <div className="min-h-[400px] bg-white dark:bg-slate-900 rounded-[3.5rem] border border-red-100 p-20 text-center shadow-xl flex flex-col items-center justify-center">
               <div className="text-5xl mb-6">🌩️</div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Neural Signal Interrupted</h2>
               <p className="text-slate-500 mb-8 max-w-sm">{error}</p>
               <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest transition-transform hover:scale-105 active:scale-95">
                 Retry Synthesis
               </button>
            </div>
          ) : analysis ? (
            <RoadmapView steps={analysis.roadmap} />
          ) : null}
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Quick Access Grid - Directable Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate('portfolio')}
              className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-500/20 hover:scale-[1.03] transition-all flex flex-col gap-4 text-left group"
            >
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center text-xl">✨</div>
              <div>
                <span className="text-[10px] font-black uppercase opacity-60">Brand Builder</span>
                <p className="font-black text-lg tracking-tight">Portfolio</p>
              </div>
            </button>
            <button 
              onClick={() => onNavigate('projects')}
              className="p-6 bg-slate-900 dark:bg-slate-800 text-white rounded-[2rem] shadow-xl hover:scale-[1.03] transition-all flex flex-col gap-4 text-left"
            >
              <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-xl">🚀</div>
              <div>
                <span className="text-[10px] font-black uppercase opacity-60">Hand-on</span>
                <p className="font-black text-lg tracking-tight">Projects</p>
              </div>
            </button>
          </div>

          <button 
            onClick={() => onNavigate('mentors')}
            className="w-full p-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-xl flex items-center gap-6 hover:-translate-y-1 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">👤</div>
            <div className="text-left">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Assigned Industry Expert</span>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Consult Mentor</p>
            </div>
          </button>

          {analysis && (
            <section className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <span className="p-2 bg-white/10 rounded-lg">💡</span> Strategy
                </h3>
                <p className="text-lg font-bold leading-relaxed italic opacity-95">"{analysis.recommendation}"</p>
                <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap gap-2">
                  {analysis.missingSkills.slice(0, 4).map(s => (
                    <span key={s} className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">{s}</span>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
