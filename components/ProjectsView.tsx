
import React from 'react';
import { UserProfile, SkillGapAnalysis, Project } from '../types';

interface ProjectsViewProps {
  profile: UserProfile;
  analysis: SkillGapAnalysis | null;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ profile, analysis }) => {
  const defaultProjects: Project[] = [
    {
      title: "Real-time Supply Chain Tracker",
      difficulty: "Intermediate",
      description: "Build a high-throughput monitoring system for the sector's primary logistics network.",
      milestones: ["API Integration", "State Management", "Data Visualization"]
    },
    {
      title: "Neural Diagnostic Toolset",
      difficulty: "Advanced",
      description: "Implement a classification model for localized sector specific anomalies.",
      milestones: ["Preprocessing", "Model Training", "Validation UI"]
    }
  ];

  const projects = analysis?.featuredProjects || defaultProjects;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-16 space-y-4">
        <div className="inline-flex px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Innovation Lab</div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Real-Life Challenges</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl">Apply your growing skill set to high-impact projects designed for the <span className="text-blue-600 font-black">{profile.sector}</span> domain.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            
            <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
              {project.difficulty}
            </span>
            
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 text-lg">
              {project.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Architecture Guidance</h4>
              <div className="flex flex-wrap gap-2">
                {project.milestones?.map((m, j) => (
                  <span key={j} className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <button className="mt-12 w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.8rem] font-black text-sm uppercase tracking-widest shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-95">
              Start Blueprinting
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
