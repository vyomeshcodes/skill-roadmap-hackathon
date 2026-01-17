
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  onLogout: () => void;
  onOpenSettings: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onOpenSettings, onNavigate, currentView, userEmail }) => {
  const [isDark, setIsDark] = React.useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const NavItem = ({ view, label, icon }: { view: ViewState, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
        ${currentView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600'}`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[60] transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">PLANIFY</span>
            </div>

            {userEmail && (
              <div className="hidden md:flex items-center gap-2">
                <NavItem view="dashboard" label="Path" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.944L9 4m0 16l6-3m-6 3V4m6 13l5.447 2.724A2 2 0 0021 17.618V8.822a2 2 0 00-1.553-1.944L15 4m0 13V4" /></svg>} />
                <NavItem view="projects" label="Projects" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
                <NavItem view="portfolio" label="Portfolio Builder" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <NavItem view="mentors" label="AI Mentors" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-blue-600 transition-all"
            >
              {isDark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l-.707-.707M6.343 6.364l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>

            {userEmail && (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <button 
                  onClick={onOpenSettings}
                  className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl text-slate-500 hover:text-blue-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <button 
                  onClick={onLogout}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
