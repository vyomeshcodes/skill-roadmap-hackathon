
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ProjectsView from './components/ProjectsView';
import PortfolioView from './components/PortfolioView';
import MentorsView from './components/MentorsView';
import PlookieChatbot from './components/PlookieChatbot';
import { UserProfile, SkillGapAnalysis, ViewState } from './types';
import { generatePersonalizedRoadmap } from './services/geminiService';
import { db } from './services/dbService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<string | null>(localStorage.getItem('planify_current_session'));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      const account = db.getCurrentUser();
      if (account) {
        if (account.profile) {
          setProfile(account.profile);
          setAnalysis(account.analysis || null);
          setView('dashboard');
        } else {
          setView('assessment');
        }
      }
    }
  }, [user]);

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setView('landing');
  };

  const handleProfileSubmit = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsLoading(true);
    setError(null);
    setView('dashboard');
    try {
      const result = await generatePersonalizedRoadmap(newProfile);
      setAnalysis(result);
      if (user) db.updateProfile(user, newProfile, result);
    } catch (e: any) {
      setError(e.message || "Synthesis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 selection:bg-blue-600 selection:text-white">
      <Navbar 
        userEmail={user || undefined} 
        onLogout={handleLogout} 
        onOpenSettings={() => setShowSettings(true)} 
        onNavigate={setView}
        currentView={view}
      />
      
      {showSettings && user && (
        <Settings email={user} onClose={() => setShowSettings(false)} onUpdate={setUser} />
      )}

      <main className="transition-all duration-700 ease-in-out">
        {view === 'landing' && <LandingPage onStart={() => setView('auth')} />}
        {view === 'auth' && <Auth onAuthSuccess={setUser} />}
        {view === 'assessment' && <AssessmentForm onSubmit={handleProfileSubmit} />}
        
        {profile && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {view === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                analysis={analysis} 
                isLoading={isLoading} 
                error={error} 
                onNavigate={setView}
              />
            )}
            {view === 'projects' && (
              <ProjectsView profile={profile} analysis={analysis} />
            )}
            {view === 'portfolio' && (
              <PortfolioView profile={profile} />
            )}
            {view === 'mentors' && (
              <MentorsView profile={profile} />
            )}
          </div>
        )}
      </main>

      <PlookieChatbot />
    </div>
  );
};

export default App;
