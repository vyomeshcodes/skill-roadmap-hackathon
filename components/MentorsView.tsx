
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Sector } from '../types';
import { createMentorChat } from '../services/geminiService';

interface MentorsViewProps {
  profile: UserProfile;
}

const MentorsView: React.FC<MentorsViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getMentorName = () => {
    switch(profile.sector) {
      case Sector.HEALTHCARE: return "Dr. Cypher";
      case Sector.AGRICULTURE: return "Gaia";
      case Sector.SMART_CITY: return "Civis";
      case Sector.FINTECH: return "Quant";
      case Sector.RENEWABLE_ENERGY: return "Solara";
      default: return "The Architect";
    }
  };

  useEffect(() => {
    chatRef.current = createMentorChat(profile.sector, profile.name);
    setMessages([{ role: 'model', text: `Greetings ${profile.name.split(' ')[0]}. I am ${getMentorName()}. I've been reviewing your goal to become a ${profile.goal}. How can I assist your technical journey today?` }]);
  }, [profile.sector]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal lost. Let's reconnect shortly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-700">
      <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
        {/* Mentor Header */}
        <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex items-center gap-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl">
            {profile.sector === Sector.HEALTHCARE ? '🩺' : 
             profile.sector === Sector.AGRICULTURE ? '🌿' : 
             profile.sector === Sector.FINTECH ? '🪙' : 
             profile.sector === Sector.SMART_CITY ? '🏙️' : '⚡'}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{getMentorName()}</h2>
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{profile.sector} Senior Advisor</p>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-6 rounded-[2rem] text-base font-medium leading-relaxed shadow-sm
                ${m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-50 dark:border-slate-700">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Consult with ${getMentorName()}...`}
              className="w-full pl-8 pr-20 py-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              Consult
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorsView;
