import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../api/client';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'ai', text: `Hello ${user?.name || 'there'}! I'm your AI assistant. How can I help you today?` }]);
    }
  }, [isOpen, messages.length, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(userText, user?.role || 'user');
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `Sorry, I encountered an error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null; // Only show for logged in users

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#462F2D] hover:bg-[#342220] text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#EAE2CE]"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-[#462F2D] p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-bold text-sm tracking-wider uppercase">{user.role} Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-[#5a3f3d] p-1 rounded-md transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FDF8F5] dark:bg-gray-900 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#462F2D] text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 text-[#462F2D] dark:text-gray-200 border border-[#EBE0C8] dark:border-gray-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 text-[#462F2D] dark:text-gray-200 border border-[#EBE0C8] dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-[#935F53] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#935F53] rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-[#935F53] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-[#F5EEDC] dark:bg-gray-700 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#462F2D] dark:focus:ring-gray-500 outline-none text-[#462F2D] dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#462F2D] hover:bg-[#342220] disabled:bg-gray-400 text-white p-2.5 rounded-full transition-colors focus:outline-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
