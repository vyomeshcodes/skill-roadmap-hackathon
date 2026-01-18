
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, FileText, Send, Sparkles, Download, 
  Eye, Layout, MousePointer2, Briefcase, User 
} from 'lucide-react';
import { aiRewritePortfolio } from '../services/geminiService';

const PortfolioBuilder = () => {
  const [sections, setSections] = useState([
    { id: '1', type: 'text', title: 'Professional Summary', content: 'Passionate software engineer focused on building resilient systems for the healthcare industry.' },
    { id: '2', type: 'experience', title: 'Recent Project', content: 'Led the development of a real-time data ingestion pipeline for MRI scans using Python and Kubernetes.' },
  ]);
  const [isPreview, setIsPreview] = useState(false);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);

  const addSection = () => {
    const id = Date.now().toString();
    setSections([...sections, { id, type: 'text', title: 'New Section', content: '' }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRewrite = async (id: string, text: string) => {
    setIsRewriting(id);
    try {
      const rewritten = await aiRewritePortfolio(text);
      updateSection(id, 'content', rewritten || text);
    } finally {
      setIsRewriting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Portfolio PRO</h2>
          <p className="text-zinc-500 text-sm">Design a world-class professional profile with AI-enhanced storytelling.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-semibold hover:text-white transition-all"
          >
            {isPreview ? <MousePointer2 size={16} /> : <Eye size={16} />}
            {isPreview ? 'Back to Editor' : 'Live Preview'}
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {/* Editor */}
        <div className={`overflow-y-auto space-y-6 pr-4 ${isPreview ? 'hidden lg:block lg:opacity-50' : ''}`}>
          <AnimatePresence>
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-6 rounded-2xl relative group border-zinc-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                      {section.id === '1' ? <User size={18} /> : <Briefcase size={18} />}
                    </div>
                    <input 
                      type="text" 
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="bg-transparent text-white font-bold border-none outline-none focus:ring-0 w-full"
                    />
                  </div>
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Describe your achievements or skills..."
                  className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-blue-500 transition-colors resize-none mb-4"
                />

                <div className="flex justify-end">
                  <button 
                    onClick={() => handleRewrite(section.id, section.content)}
                    disabled={isRewriting === section.id || !section.content}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-blue-400 rounded-lg text-xs font-bold transition-all"
                  >
                    <Sparkles size={14} className={isRewriting === section.id ? 'animate-spin' : ''} />
                    AI Rewrite
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={addSection}
            className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Section
          </button>
        </div>

        {/* Preview */}
        <div className={`overflow-y-auto ${!isPreview ? 'hidden lg:block' : 'w-full'}`}>
          <div className="bg-white text-zinc-900 p-12 min-h-full rounded-2xl shadow-2xl shadow-black">
            <header className="mb-12 border-b-2 border-zinc-100 pb-8">
              <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase">ALEX DUNCAN</h1>
              <p className="text-zinc-500 font-mono text-sm">SENIOR HEALTH-TECH ARCHITECT • 8+ YEARS EXP</p>
            </header>

            <div className="space-y-10">
              {sections.map(section => (
                <section key={section.id}>
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">{section.title}</h3>
                  <p className="text-lg leading-relaxed text-zinc-800 font-medium">
                    {section.content || <span className="text-zinc-300 italic">Content pending...</span>}
                  </p>
                </section>
              ))}

              <div className="pt-12 border-t border-zinc-100 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2">Technical Core</h4>
                  <div className="flex flex-wrap gap-2">
                    {['DICOM', 'FHIR', 'React', 'Node.js', 'AWS'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2">Network</h4>
                  <p className="text-[10px] text-zinc-500">linkedin.com/in/alexduncan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
