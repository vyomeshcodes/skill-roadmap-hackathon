
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Brain, Sparkles, X, Loader2, Target, Globe, Plus, AlertCircle } from 'lucide-react';
import { DomainType } from '../types';
import { authService } from '../services/authService';
import { userStore } from '../services/userStore';
import { generateSkillAnalysis, generateRoadmap } from '../services/geminiService';
import { AuthContext } from '../App';

const SECTOR_SKILLS: Record<DomainType, string[]> = {
  [DomainType.HEALTHCARE_TECH]: ['HL7/FHIR', 'DICOM', 'HIPAA', 'EHR Systems', 'Bioinformatics', 'Medical Imaging AI'],
  [DomainType.AGRI_TECH]: ['Precision Farming', 'IoT Sensors', 'GIS Mapping', 'Drone Data Analysis', 'Soil Science AI'],
  [DomainType.SMART_CITY]: ['Smart Grids', 'Urban Planning', 'ITS', 'Edge Computing', 'SCADA Systems', 'Sustainable Energy']
};

const Assessment = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);
  const user = authService.getCurrentUser();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: user?.sector || DomainType.HEALTHCARE_TECH,
    skills: [] as string[],
    proficiency: 50,
    goal: ''
  });
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setCustomSkillInput('');
    }
  };

  const handleComplete = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    console.log("Starting roadmap synthesis with Groq...");

    try {
      const [skillsResult, roadmapSteps] = await Promise.all([
        generateSkillAnalysis(formData.sector, `Skills: ${formData.skills.join(', ')}. Level: ${formData.proficiency}%`),
        generateRoadmap(formData.sector, formData.skills, formData.goal)
      ]);

      console.log("Intelligence received:", { skillsResult, roadmapSteps });

      if (!roadmapSteps || roadmapSteps.length === 0) {
        throw new Error("AI failed to generate roadmap steps. Please check your goal and try again.");
      }

      const updatedUser = {
        ...user,
        sector: formData.sector,
        skills: formData.skills,
        assessmentScore: formData.proficiency,
        roadmaps: [{
          id: Date.now().toString(),
          goal: formData.goal,
          steps: roadmapSteps,
          skillAnalysis: skillsResult,
          generatedAt: new Date().toISOString()
        }]
      };

      // Save to storage
      authService.updateUser(updatedUser);
      userStore.saveProfile(updatedUser);
      
      // Sync global state
      refreshUser();

      console.log("Persistence complete. Navigating to roadmap.");
      navigate('/roadmap');
    } catch (e: any) {
      console.error("Critical Assessment Failure:", e);
      setError(e.message || "An unexpected error occurred during intelligence synthesis.");
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
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">Active <span className="text-emerald-500">Stack</span></h1>
                <p className="text-zinc-500 text-sm">Select from suggestions or add your unique technical skills.</p>
              </div>
              
              <div className="space-y-6">
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
                  
                  {formData.skills.filter(s => !SECTOR_SKILLS[formData.sector].includes(s)).map(s => (
                    <button
                      key={s}
                      onClick={() => handleSkillToggle(s)}
                      className="px-6 py-3 rounded-xl border border-emerald-500 bg-emerald-600/10 text-emerald-400 text-sm font-bold transition-all flex items-center gap-2 group"
                    >
                      {s}
                      <X size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-900">
                  <form onSubmit={handleAddCustomSkill} className="relative max-w-sm">
                    <input 
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add custom skill (e.g. CUDA, Terraform...)"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-zinc-100 outline-none focus:border-emerald-600 transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!customSkillInput.trim()}
                      className="absolute right-2 top-1.5 p-1.5 bg-zinc-800 text-zinc-400 hover:text-emerald-400 disabled:opacity-30 transition-colors rounded-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white"><ArrowLeft size={18} /> Back</button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={formData.skills.length === 0}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-50 transition-opacity"
                >
                  Next <ArrowRight size={18} />
                </button>
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

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="flex justify-between pt-8">
                <button 
                  onClick={() => setStep(3)} 
                  className="flex items-center gap-2 text-zinc-500 font-bold hover:text-white disabled:opacity-50" 
                  disabled={loading}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleComplete}
                  disabled={loading || !formData.goal}
                  className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin" size={24} />
                      <span className="text-sm">Synthesizing...</span>
                    </div>
                  ) : (
                    <><Sparkles size={24} /> Generate Roadmap</>
                  )}
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
