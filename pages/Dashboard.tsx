
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Clock, ArrowUpRight, ArrowRight, Zap, ChevronRight, Bookmark, Sparkles } from 'lucide-react';
import { DomainType } from '../types';
import { generateSkillAnalysis } from '../services/geminiService';
import { authService } from '../services/authService';

const MOCK_RADAR = [
  { subject: 'Core Logic', current: 75, required: 90 },
  { subject: 'Domain Knowledge', current: 45, required: 85 },
  { subject: 'Sys Design', current: 80, required: 80 },
  { subject: 'Ethical AI', current: 30, required: 95 },
  { subject: 'Ops Efficiency', current: 55, required: 70 },
  { subject: 'Interface DX', current: 90, required: 85 },
];

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const [domain, setDomain] = useState<DomainType>(user?.sector || DomainType.HEALTHCARE_TECH);
  const currentRoadmap = user?.roadmaps?.[0];
  const [skillData, setSkillData] = useState(currentRoadmap?.skillAnalysis || MOCK_RADAR);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await generateSkillAnalysis(domain, `Profile: ${user.name}. Skills: ${user.skills.join(', ')}`);
      setSkillData(result.skills);
      const updatedRoadmaps = user.roadmaps || [];
      if (updatedRoadmaps.length > 0) {
        updatedRoadmaps[0] = { ...updatedRoadmaps[0], skillAnalysis: result.skills };
      }
      authService.updateUser({ ...user, roadmaps: updatedRoadmaps });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.assessmentScore && user?.assessmentScore !== 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[3rem] border-zinc-800/50 max-w-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={120} className="text-blue-500" /></div>
          <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
            <Sparkles className="text-blue-500" size={40} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Intelligence Incomplete</h2>
          <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
            Welcome, {user?.name?.split(' ')[0]}. To unlock your personalized career roadmap and domain mentorship, you must first complete your professional assessment.
          </p>
          <Link 
            to="/assessment" 
            className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all group"
          >
            Give Assessment Test <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Good morning, {user?.name?.split(' ')[0]}</h2>
          <p className="text-zinc-500">Your current {user?.sector} profile is being benchmarked against the latest global trends.</p>
        </motion.div>
        
        {currentRoadmap?.goal && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
             <Bookmark size={16} className="text-blue-500" />
             <div>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active Goal</p>
               <p className="text-xs font-semibold text-zinc-100">{currentRoadmap.goal}</p>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Intelligence Level', value: `${user?.assessmentScore || 0}%`, icon: Target, trend: 'Assessment Result', color: 'text-blue-500' },
          { label: 'Skills Tracked', value: user?.skills?.length || 0, icon: Award, trend: 'In Profile', color: 'text-emerald-500' },
          { label: 'Current Phase', value: '1', icon: Clock, trend: 'Roadmap Milestone', color: 'text-amber-500' },
          { label: 'Growth Status', value: 'Steady', icon: TrendingUp, trend: 'Analysis Active', color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass p-6 rounded-2xl group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-mono text-zinc-500">{stat.trend}</span>
            </div>
            <h4 className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</h4>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Intelligence Radar</h3>
              <p className="text-sm text-zinc-500">Comparing profile to {domain} benchmarks.</p>
            </div>
            <button onClick={handleRefresh} disabled={isLoading} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
              <Zap size={16} fill="white" className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Required" dataKey="required" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6">Current Skill Set</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {user?.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400">{skill}</span>
              ))}
              {(!user?.skills || user.skills.length === 0) && <p className="text-zinc-600 text-sm">No skills listed yet.</p>}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-6">Strategic Roadmap</h3>
            <div className="space-y-4">
              {currentRoadmap?.steps?.slice(0, 3).map((step: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors group">
                  <div className={`w-1 h-10 rounded-full bg-blue-500`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Phase {i + 1}</span>
                      <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-100">{step.title}</p>
                  </div>
                </div>
              ))}
              {!currentRoadmap?.steps && (
                <p className="text-zinc-600 text-sm">Complete assessment to see roadmap.</p>
              )}
            </div>
            <Link to="/roadmap" className="w-full mt-8 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
              View Complete Strategy <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
