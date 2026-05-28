import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, X, Send, User, ChevronUp, Clock, HelpCircle } from 'lucide-react';
import { Message } from '../types';

export default function ButlerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: "Blessings and welcome, Respected Guest. I am Aarya, your Royal AI Concierge of Aaryam Hotel & Resorts. Allow me the extreme honor of orchestrating your mountainside escape. What element of our sanctuary may I detail for you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const starters = [
    "Tell me about the Retractable Sky Ceiling.",
    "What Ayurvedic dishes are served at Soma?",
    "Describe the Tejas Suite with Butler service.",
    "What packages are offered at Akasha Spa?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `m-${Date.now()}-u`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Map history to server spec
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: historyPayload
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data && data.success) {
        const butlerMessage: Message = {
          id: `m-${Date.now()}-b`,
          role: 'model',
          text: data.reply,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, butlerMessage]);
      } else {
        throw new Error();
      }

    } catch (e) {
      setIsLoading(false);
      const errorMessage: Message = {
        id: `m-${Date.now()}-err`,
        role: 'model',
        text: "My deepest apologies, honored guest. A light evening valley shadow is causing a brief halt in my transmitter. The Prithvi Suite and Tejas Suite are fully operational and waiting to greet you. Please let me know what day you prefer to check in.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="butler-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="luxury-gold-gradient text-white p-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer border border-white/20 hover:scale-105 active:scale-95 transition-all group"
          whileHover={{ boxShadow: "0 10px 25px rgba(212, 175, 55, 0.4)" }}
          layout
        >
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-out text-xs font-semibold uppercase tracking-widest block whitespace-nowrap">
            Butler Aarya
          </span>
          <MessageSquare className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Slide-out Frosted Canvas Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="butler-chat-drawer"
            className="fixed bottom-24 right-6 z-40 w-full max-w-[420px] h-[550px] rounded-sm shadow-2xl border border-white/60 frosted-glass-card text-luxury-green-900 flex flex-col justify-between overflow-hidden"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header segment */}
            <div className="p-4 bg-luxury-green-905 bg-luxury-green-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-luxury-gold-500 flex items-center justify-center shadow-lg shadow-black/20 shrink-0 border border-white/10">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif-luxury text-sm font-bold tracking-wide">Aarya Concierge</h4>
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-luxury-gold-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>In the Valley Office</span>
                  </div>
                </div>
              </div>
              <button
                id="butler-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Log area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans bg-white/30 backdrop-blur-md">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    id={`chat-msg-${m.id}`}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* User / model Avatar */}
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] uppercase font-bold border shadow-sm ${
                      isUser 
                        ? 'bg-luxury-green-900 border-luxury-green-800 text-white' 
                        : 'bg-white border-luxury-gold-500/20 text-luxury-gold-700'
                    }`}>
                      {isUser ? <User className="w-3.5 h-3.5" /> : 'A'}
                    </div>

                    {/* Speech box */}
                    <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 text-xs leading-relaxed border shadow-sm ${
                        isUser
                          ? 'bg-luxury-green-900 text-white rounded-l-md rounded-br-md border-luxury-green-800'
                          : 'bg-white/90 text-luxury-green-950 rounded-r-md rounded-bl-md border-white/40'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[8px] opacity-40 mt-1 uppercase font-mono">
                        {formatTime(m.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* simulated loader typing aspect */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-white border border-luxury-gold-500/20 text-luxury-gold-700 flex items-center justify-center text-[10px]">
                    A
                  </div>
                  <div className="bg-white/80 border border-white/40 p-3 rounded-r-md rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold-500 animate-bounce duration-300 [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold-500 animate-bounce duration-300 [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold-500 animate-bounce duration-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interactive conversation starter tags */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white/20 border-t border-black/5 flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] uppercase tracking-wider text-luxury-gold-700 font-bold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Suggested inquiries:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {starters.map((starter, i) => (
                    <button
                      key={i}
                      id={`chat-starter-${i}`}
                      onClick={() => handleSendMessage(starter)}
                      className="text-[10px] text-left hover:bg-luxury-gold-500/10 border border-luxury-gold-500/20 bg-white/70 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Input block */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white/80 border-t border-black/5 flex items-center gap-2 shrink-0"
            >
              <input
                id="butler-chat-input"
                type="text"
                placeholder="Inquire about dinner, elements, hot cedar spa..."
                className="flex-1 bg-luxury-gold-50 border border-black/10 text-xs p-2.5 rounded focus:outline-none focus:border-luxury-gold-500 font-medium text-luxury-green-950 placeholder-luxury-green-900/40"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                id="butler-send-message-btn"
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 rounded-full bg-luxury-green-900 hover:bg-luxury-gold-500 disabled:bg-luxury-green-950/20 text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
