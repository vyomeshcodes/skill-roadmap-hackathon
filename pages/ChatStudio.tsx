
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Phone, Video, MoreHorizontal, Zap } from 'lucide-react';
import { DomainType, Message } from '../types';
import { getMentorResponse } from '../services/geminiService';

const ChatStudio = () => {
  const [domain, setDomain] = useState<DomainType>(DomainType.HEALTHCARE_TECH);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Greetings. I am your specialized mentor in ${domain}. How can I assist with your career trajectory today?`, timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getMentorResponse(domain, messages, input);
      const mentorMsg: Message = { role: 'model', text: response || 'I apologize, I could not process that request.', timestamp: new Date() };
      setMessages(prev => [...prev, mentorMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex gap-8">
      {/* Mentor Sidebar */}
      <div className="hidden lg:flex flex-col w-72 space-y-4">
        <div className="glass p-6 rounded-3xl text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-zinc-900 shadow-xl" />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-zinc-900" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Dr. Aris Vane</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">Chief Strategist</p>
          <div className="flex justify-center gap-2">
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><Phone size={16} /></button>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><Video size={16} /></button>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl flex-1">
          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Focus Area</h4>
          <div className="space-y-2">
            {Object.values(DomainType).map(d => (
              <button 
                key={d}
                onClick={() => setDomain(d)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${domain === d ? 'bg-blue-600 text-white font-bold' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden border-zinc-800/50">
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-semibold text-zinc-100">Live Mentorship: {domain}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
             <Sparkles size={14} className="text-blue-400" />
             <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">AI Enhanced</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Bot size={16} /></div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-75" />
                    <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about certifications, salary benchmarks, or project strategies..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-6 pr-16 py-4 text-sm text-zinc-100 outline-none focus:border-blue-600 transition-colors"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-3 text-center">Mentor insights are generated by Stratum Core. Verify technical specifications for critical deployments.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatStudio;
