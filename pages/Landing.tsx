
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-blue-500/30">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Zap size={18} fill="white" />
          </div>
          STRATUM
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Intelligence', 'Mentorship', 'Pricing'].map((item) => (
            <a key={item} href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <Link to="/dashboard" className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-200 transition-all shadow-xl shadow-white/10">
          Enter Platform
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-32 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            v2.5 Intelligence Engine Now Live
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] gradient-text">
            Architect Your Future <br className="hidden md:block" /> with AI Precision.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The world-class intelligence platform for specialists in Healthcare, AgriTech, and Smart Cities. Bridging the gap between ambition and professional mastery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group">
              Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl font-semibold transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass rounded-3xl p-10 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <Cpu className="text-blue-500 mb-6" size={32} />
              <h3 className="text-2xl font-bold mb-4">Domain Mastery</h3>
              <p className="text-zinc-400 max-w-md">Precision intelligence tailored for the specific technical requirements of high-impact industries.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-3xl p-10 flex flex-col justify-between"
          >
            <Shield className="text-indigo-500 mb-6" size={32} />
            <div>
              <h3 className="text-xl font-bold mb-2">Portfolio Engine</h3>
              <p className="text-sm text-zinc-400">Generate professional, high-converting portfolios verified by AI experts.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-3xl p-10"
          >
            <Globe className="text-emerald-500 mb-6" size={32} />
            <h3 className="text-xl font-bold mb-2">Global Network</h3>
            <p className="text-sm text-zinc-400">Connect with domain mentors across 40+ countries in real-time.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass rounded-3xl p-10 flex items-center justify-between gap-8 group"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Deep Skill Analysis</h3>
              <p className="text-zinc-400">Our radar engine maps your trajectory against current market leaders to identify critical learning paths.</p>
            </div>
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-32 bg-zinc-800 rounded-lg group-hover:bg-blue-500/30 transition-all" style={{ height: `${20 + i * 20}%` }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-8 max-w-7xl mx-auto text-center">
        <p className="text-zinc-600 text-sm">© 2025 Stratum AI. Built for the next generation of domain experts.</p>
      </footer>
    </div>
  );
};

export default Landing;
