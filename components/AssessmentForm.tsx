
import React, { useState } from 'react';
import { UserProfile, Sector, SkillLevel } from '../types';
import { SECTORS, SKILL_LEVELS, SUGGESTED_SKILLS } from '../constants';

interface AssessmentFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit }) => {
  // Fix: Removed 'certificates' property as it is not defined in the UserProfile interface
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    goal: '',
    skills: [],
    sector: Sector.HEALTHCARE,
    studyHoursPerDay: 2,
    level: SkillLevel.BEGINNER
  });
  
  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name || !profile.goal || profile.skills.length === 0) {
      alert('Please fill in your name, goal, and at least one skill.');
      return;
    }
    onSubmit(profile);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">
          <h2 className="text-3xl font-bold">Planify Your Career</h2>
          <p className="opacity-90 mt-2 text-lg">Define your goal and let AI map the path for you.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Alex Johnson"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Target Sector</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={profile.sector}
                onChange={e => setProfile({...profile, sector: e.target.value as Sector})}
              >
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">What is your ultimate career goal?</label>
            <textarea
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
              placeholder="e.g. I want to become a Lead Data Scientist in a healthcare startup within 2 years."
              value={profile.goal}
              onChange={e => setProfile({...profile, goal: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Your Current Expertise</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Add a skill you already possess..."
                value={currentSkill}
                onChange={e => setCurrentSkill(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill(currentSkill))}
              />
              <button
                type="button"
                onClick={() => addSkill(currentSkill)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-200 group">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-blue-400 hover:text-red-500 transition-colors">&times;</button>
                </span>
              ))}
              {profile.skills.length === 0 && <p className="text-slate-400 text-sm italic">No skills added yet.</p>}
            </div>

            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Recommended for {profile.sector}:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS[profile.sector].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    disabled={profile.skills.includes(skill)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                      profile.skills.includes(skill)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                    }`}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Proficiency Level</label>
              <div className="flex gap-2">
                {SKILL_LEVELS.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setProfile({...profile, level})}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                      profile.level === level 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Study Commitment</label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="range"
                  min="1"
                  max="12"
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={profile.studyHoursPerDay}
                  onChange={e => setProfile({...profile, studyHoursPerDay: parseInt(e.target.value)})}
                />
                <span className="font-bold text-blue-600 whitespace-nowrap">{profile.studyHoursPerDay} hrs / day</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate My Career Path
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;
