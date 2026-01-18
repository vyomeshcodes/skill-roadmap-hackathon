
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Target, ExternalLink, Zap, Sparkles, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { userStore } from '../services/userStore';
import { generateRoadmap } from '../services/geminiService';

const Roadmap = () => {
  const user = authService.getCurrentUser();
  const currentRoadmap = user?.roadmaps?.[0];
  
  const [steps, setSteps] = useState<any[]>(currentRoadmap?.steps || []);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleStep = (title: string) => {
    setCompleted(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const refreshRoadmap = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newSteps = await generateRoadmap(user.sector, user.skills, currentRoadmap?.goal || `Growth in ${user.sector}`);
      setSteps(newSteps);
      
      const updatedUser = {
        ...user,
        roadmaps: [{ ...currentRoadmap, steps: newSteps, generatedAt: new Date().toISOString() }]
      };
      authService.updateUser(updatedUser);
      userStore.saveProfile(updatedUser);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (steps.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Zap className="text-blue-600 mb-6" size={48} fill="currentColor" />
        <h2 className="text-3xl font-bold text-white mb-4">No Trajectory Found</h2>
        <p className="text-zinc-500 max-w-sm mb-10">Complete your professional assessment to unlock your personalized career roadmap.</p>
        <button 
          onClick={() => window.location.href = '#/assessment'} 
          className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/20"
        >
          Initialize Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-blue-500" size={16} />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">AI Career Architecture</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">Strategic Roadmap</h2>
          <p className="text-zinc-500">Mission: <span className="text-zinc-300 font-semibold">{currentRoadmap?.goal}</span></p>
        </div>
        <button 
          onClick={refreshRoadmap} disabled={loading}
          className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
          Regenerate Strategy
        </button>
      </header>

      <div className="relative space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-blue-600 via-zinc-800 to-transparent" />

        {steps.map((step, i) => {
          const isDone = completed.includes(step.title);
          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="relative pl-20 group"
            >
              <button 
                onClick={() => toggleStep(step.title)}
                className={`absolute left-0 top-2 w-16 h-16 flex items-center justify-center rounded-full border-4 border-zinc-950 z-10 transition-all duration-500 ${isDone ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-zinc-900 text-zinc-700 border-zinc-800 hover:border-zinc-700'}`}
              >
                {isDone ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>

              <div className={`glass p-8 rounded-[2.5rem] border transition-all duration-300 ${isDone ? 'opacity-40 grayscale border-emerald-500/20' : 'hover:border-zinc-700 shadow-xl'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Phase {i + 1}</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{step.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">{step.description}</p>
                    
                    <div className="flex flex-wrap gap-6 pt-6 border-t border-zinc-800/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                        <Clock size={16} className="text-blue-500" />
                        <span>{step.estimatedWeeks} Weeks</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                        <Target size={16} className="text-indigo-500" />
                        <span>Domain Milestone</span>
                      </div>
                    </div>
                  </div>

                  {step.courseLink && (
                    <div className="flex items-start">
                      <a 
                        href={step.courseLink} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black text-zinc-200 hover:bg-white hover:text-black transition-all group/btn"
                      >
                        Enroll <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
