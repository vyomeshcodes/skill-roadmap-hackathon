
import React, { useState, useEffect } from 'react';
import { RoadmapStep } from '../types';

interface RoadmapViewProps {
  steps: RoadmapStep[];
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ steps }) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('planify_tasks_v3');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('planify_tasks_v3', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (week: number, idx: number) => {
    const key = `w${week}-t${idx}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getWeekProgress = (step: RoadmapStep) => {
    const total = step.tasks.length;
    const done = step.tasks.filter((_, i) => completedTasks[`w${step.week}-t${i}`]).length;
    return (done / total) * 100;
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-4 px-2">
        <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Your Mastery Arc</h2>
      </div>

      <div className="space-y-8">
        {steps.map((step, idx) => {
          const progress = getWeekProgress(step);
          const isCurrent = progress < 100 && (idx === 0 || getWeekProgress(steps[idx - 1]) === 100);

          return (
            <div key={idx} className={`relative group transition-all duration-700 ${isCurrent ? 'scale-[1.02]' : 'opacity-80'}`}>
              <div className={`p-10 rounded-[3rem] shadow-2xl border transition-all duration-500 
                ${isCurrent 
                  ? 'bg-white dark:bg-slate-900 border-blue-600/30 ring-4 ring-blue-600/5' 
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-4 
                      ${progress === 100 ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {progress === 100 ? '✓' : `0${step.week}`}
                    </div>
                    <div className="h-full w-0.5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{step.topic}</h3>
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{Math.round(progress)}% Done</span>
                      </div>
                      <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">{step.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.tasks.map((task, tIdx) => {
                        const isDone = completedTasks[`w${step.week}-t${tIdx}`];
                        return (
                          <button 
                            key={tIdx} 
                            onClick={() => toggleTask(step.week, tIdx)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all 
                              ${isDone ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-blue-500/20'}`}
                          >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 
                              ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-700'}`}>
                              {isDone && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-2">
                      {step.resources.map((res, i) => (
                        <span key={i} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{res}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapView;
