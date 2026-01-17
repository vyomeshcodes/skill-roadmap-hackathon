
import React, { useState } from 'react';
import { db } from '../services/dbService';

interface SettingsProps {
  email: string;
  onClose: () => void;
  onUpdate: (newEmail: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ email, onClose, onUpdate }) => {
  const [newEmail, setNewEmail] = useState(email);
  const [newPass, setNewPass] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    setIsUpdating(true);
    setError('');
    
    // Simulate network delay
    setTimeout(() => {
      try {
        if (db.updateAccount(email, newEmail, newPass || undefined)) {
          onUpdate(newEmail);
          onClose();
        } else {
          setError('Could not update account details.');
        }
      } catch (e) {
        setError('An unexpected error occurred.');
      }
      setIsUpdating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] shadow-2xl relative z-10 p-12 border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Command Settings</h2>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Manage your profile identity</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-colors">
             <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
            {error}
          </div>
        )}
        
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] ml-2">Identity Email</label>
            <input 
              type="email" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-blue-500/20 outline-none dark:text-white font-bold transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] ml-2">Secure Access Key (New Password)</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={newPass} 
              onChange={e => setNewPass(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-blue-500/20 outline-none dark:text-white font-bold transition-all"
            />
            <p className="text-[10px] text-slate-400 ml-2">Leave blank to keep your existing password.</p>
          </div>
          
          <div className="flex gap-6 pt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-5 font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest text-xs"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Syncing...
                </>
              ) : "Update Identity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
