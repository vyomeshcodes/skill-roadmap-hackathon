
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [regenerateKey, setRegenerateKey] = useState(0);

  const toggleStep = (title: string) => {
    setCompleted(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const refreshRoadmap = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'User not found. Please log in again.' });
      return;
    }
    
    if (!user.skills || user.skills.length === 0) {
      setMessage({ type: 'error', text: 'No skills found. Please complete your assessment.' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const newSteps = await generateRoadmap(user.sector, user.skills, currentRoadmap?.goal || `Growth in ${user.sector}`);
      
      // Validate response
      if (!newSteps || !Array.isArray(newSteps) || newSteps.length === 0) {
        console.error('Invalid roadmap response:', newSteps);
        setMessage({ type: 'error', text: 'Failed to generate roadmap. Please try again.' });
        return;
      }
      
      setSteps(newSteps);
      setCompleted([]); // Reset completed steps
      
      const updatedRoadmaps = (user.roadmaps || []).map((roadmap, idx) => 
        idx === 0 ? { ...roadmap, steps: newSteps, generatedAt: new Date().toISOString() } : roadmap
      );
      
      const updatedUser = {
        ...user,
        roadmaps: updatedRoadmaps.length > 0 ? updatedRoadmaps : [{ 
          id: Date.now().toString(), 
          steps: newSteps, 
          goal: currentRoadmap?.goal || `Growth in ${user.sector}`, 
          generatedAt: new Date().toISOString() 
        }]
      };
      
      authService.updateUser(updatedUser);
      userStore.saveProfile(updatedUser);
      setMessage({ type: 'success', text: 'Roadmap regenerated successfully!' });
      setRegenerateKey(prev => prev + 1); // Force re-render of steps
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Roadmap refresh error:', error);
      const errorMsg = error?.message || 'Error regenerating roadmap. Please check your internet connection and try again.';
      setMessage({ type: 'error', text: errorMsg });
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
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}
      
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
          onClick={refreshRoadmap} 
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 border border-blue-500 disabled:border-zinc-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-blue-500/20 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Regenerating...</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              Regenerate Strategy
            </>
          )}
        </button>
      </header>

      <div className="relative space-y-12" key={regenerateKey}>
        {/* Vertical Line */}
        <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-blue-600 via-zinc-800 to-transparent" />

        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Roadmap;
