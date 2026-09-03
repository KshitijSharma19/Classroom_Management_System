import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI classroom assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize Gemini API
      // Note: In production, API calls should go through your backend to protect the API key.
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'REPLACE_WITH_YOUR_GEMINI_API_KEY';
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
      const prompt = `You are a helpful AI assistant for an EduTech Classroom Management System. Answer this question from a user: ${userMessage}`;
      
      if (API_KEY === 'REPLACE_WITH_YOUR_GEMINI_API_KEY') {
         setTimeout(() => {
           setMessages(prev => [...prev, { 
             text: "I see you haven't set up your Gemini API key in the .env file yet! Please add VITE_GEMINI_API_KEY to your environment variables.", 
             isBot: true 
           }]);
           setIsLoading(false);
         }, 1000);
         return;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { text: text, isBot: true }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-bg-surface border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <h3 className="font-bold">AI Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.isBot ? 'bg-bg-surface border border-border text-text-primary rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 text-sm shadow-sm bg-bg-surface border border-border text-text-primary rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-bg-surface border-t border-border flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..." 
            className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-text-primary"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
