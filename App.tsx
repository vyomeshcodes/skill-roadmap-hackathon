
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Map, Briefcase, MessageSquare, UserCircle, Menu, Zap, LogOut 
} from 'lucide-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import PortfolioBuilder from './pages/PortfolioBuilder';
import ChatStudio from './pages/ChatStudio';
import Opportunities from './pages/Opportunities';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import { authService } from './services/authService';
import { User } from './types';

// Auth Context
const AuthContext = createContext<{
  user: User | null;
  logout: () => void;
  loginSuccess: (user: User) => void;
}>({
  user: null,
  logout: () => {},
  loginSuccess: () => {},
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-white/10 text-white shadow-lg' 
        : 'text-zinc-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  
  const noSidebarRoutes = ['/', '/login', '/signup', '/assessment'];
  const isNoSidebar = noSidebarRoutes.includes(location.pathname);

  if (isNoSidebar) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800/50 flex flex-col z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={18} fill="white" />
            </div>
            STRATUM
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
          <SidebarLink to="/roadmap" icon={Map} label="Career Roadmap" active={location.pathname === '/roadmap'} />
          <SidebarLink to="/portfolio" icon={UserCircle} label="Portfolio PRO" active={location.pathname === '/portfolio'} />
          <SidebarLink to="/chat" icon={MessageSquare} label="Mentor Studio" active={location.pathname === '/chat'} />
          <SidebarLink to="/opportunities" icon={Briefcase} label="Opportunities" active={location.pathname === '/opportunities'} />
        </nav>

        <div className="p-6">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto scroll-smooth">
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white"><Menu size={24} /></button>
            <h1 className="text-lg font-semibold text-zinc-100 capitalize">{location.pathname.replace('/', '').replace(/-/g, ' ') || 'Overview'}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user?.sector}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10 shadow-lg flex items-center justify-center font-bold text-white">
               {user?.name?.[0]}
             </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());

  const loginSuccess = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loginSuccess }}>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatStudio /></ProtectedRoute>} />
            <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </AuthContext.Provider>
  );
}
