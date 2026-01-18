
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Brain, Sparkles, X, Loader2, Target, Globe } from 'lucide-react';
import { DomainType } from '../types';
import { authService } from '../services/authService';
import { userStore } from '../services/userStore';
import { generateSkillAnalysis, generateRoadmap } from '../services/geminiService';

const SECTOR_SKILLS: Record<DomainType, string[]> = {
  [DomainType.HEALTHCARE_TECH]: ['HL7/FHIR', 'DICOM', 'HIPAA', 'EHR Systems', 'Bioinformatics', 'Medical Imaging AI'],
  [DomainType.AGRI_TECH]: ['Precision Farming', 'IoT Sensors', 'GIS Mapping', 'Drone Data Analysis', 'Soil Science AI'],
  [DomainType.SMART_CITY]: ['Smart Grids', 'Urban Planning', 'ITS', 'Edge Computing', 'SCADA Systems', 'Sustainable Energy']
};

const Assessment = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: user?.sector || DomainType.HEALTHCARE_TECH,
    skills: [] as string[],
    proficiency: 50,
    goal: ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Parallel Intelligence Generation
      const [analysis, roadmap] = await Promise.all([
        generateSkillAnalysis(formData.sector, `Skills: ${formData.skills.join(', ')}. Level: ${formData.proficiency}%`),
        generateRoadmap(formData.sector, formData.skills, formData.goal)
      ]);

      const updatedUser = {
        ...user,
        sector: formData.sector,
        skills: formData.skills,
        assessmentScore: formData.proficiency,
        roadmaps: [{
          id: Date.now().toString(),
          goal: formData.goal,
          steps: roadmap,
          skillAnalysis: analysis.skills,
          generatedAt: new Date().toISOString()
        }]
      };

      // 2. Multi-layer Persistence
      authService.updateUser(updatedUser);
      userStore.saveProfile(updatedUser);

      // 3. Navigation
      navigate('/roadmap');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stage {step} of 4</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Target <span className="text-blue-500">Domain</span></h1>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(DomainType).map(d => (
                  <button
                    key={d}
                    onClick={() => { setFormData({...formData, sector: d}); setStep(2); }}
                    className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${formData.sector === d ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                  >
                    <span className="font-bold">{d}</span>
                    <Globe size={18} className={formData.sector === d ? 'text-blue-500' : 'text-zinc-700'} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Active <span className="text-emerald-500">Stack</span></h1>
              <div className="flex flex-wrap gap-3">
                {SECTOR_SKILLS[formData.sector].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSkillToggle(s)}
                    className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${formData.skills.includes(s) ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white"><ArrowLeft size={18} /> Back</button>
                <button onClick={() => setStep(3)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2">Next <ArrowRight size={18} /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Current <span className="text-amber-500">Expertise</span></h1>
              <div className="glass p-10 rounded-3xl">
                <div className="flex justify-between mb-8">
                  <span className="text-sm font-bold text-zinc-500 uppercase">Proficiency Level</span>
                  <span className="text-3xl font-black text-amber-500">{formData.proficiency}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={formData.proficiency} 
                  onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                  className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
              </div>
              <div className="flex justify-between pt-8">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white"><ArrowLeft size={18} /> Back</button>
                <button onClick={() => setStep(4)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2">Next <ArrowRight size={18} /></button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Career <span className="text-indigo-500">Mission</span></h1>
              <div className="glass p-8 rounded-3xl">
                <input 
                  type="text"
                  autoFocus
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  placeholder="e.g. Lead Smart City Infrastructure Engineer"
                  className="w-full bg-transparent border-none outline-none text-2xl font-bold text-white placeholder:text-zinc-800"
                />
              </div>
              <div className="flex justify-between pt-8">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white disabled:opacity-50" disabled={loading}><ArrowLeft size={18} /> Back</button>
                <button 
                  onClick={handleComplete}
                  disabled={loading || !formData.goal}
                  className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={24} /> Generate Roadmap</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;
