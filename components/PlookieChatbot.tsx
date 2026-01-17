
import React, { useState, useRef, useEffect } from 'react';
import { createPlookieChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PlookieChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hey there! I’m Plookie. Ready to build your legendary career path today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat only when needed
  const getChat = () => {
    if (!chatInstance.current) {
      chatInstance.current = createPlookieChat();
    }
    return chatInstance.current;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const chat = getChat();
      const response = await chat.sendMessage({ message: userMsg });
      const botText = response.text || "I'm having a bit of a brain fog... try asking that again!";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Oof, my neural links got crossed. Let me try to reconnect." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const QuickAction = ({ text }: { text: string }) => (
    <button 
      onClick={() => { setInput(text); }}
      className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all whitespace-nowrap"
    >
      {text}
    </button>
  );

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[380px] h-[550px] bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_128px_-32px_rgba(30,58,138,0.4)] border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-inner">🤖</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-black text-lg tracking-tight">Plookie</h3>
                <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-widest">Active Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 dark:bg-white/10 text-slate-100 border border-white/5 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-0 space-y-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 text-white">
              <QuickAction text="Explain my roadmap" />
              <QuickAction text="Skill suggestions" />
              <QuickAction text="Career tips" />
            </div>
            
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Plookie anything..."
                className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-500 font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 transform active:scale-90
          ${isOpen 
            ? 'bg-slate-900 border border-white/10 rotate-90 scale-0 opacity-0' 
            : 'bg-gradient-to-tr from-blue-600 to-indigo-700 hover:rotate-12 hover:shadow-blue-500/40 text-white'}`}
      >
        <span className="relative">
          🤖
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
          </span>
        </span>
      </button>

      {/* Mini Close if Open */}
      {isOpen && (
        <button 
          onClick={() => setIsOpen(false)}
          className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PlookieChatbot;
