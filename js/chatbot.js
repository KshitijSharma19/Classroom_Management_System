/**
 * chatbot.js - AI Chatbot Integration via Gemini API
 */

// User will place their API key here
const API_KEY = GEMINI_API_KEY;

class EduChatbot {
    constructor() {
        this.apiKey = GEMINI_API_KEY;
        this.isOpen = false;
        this.chatHistory = [];
        this.initUI();
    }

    initUI() {
        // Create Floating Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'chatbot-toggle';
        toggleBtn.className = 'fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-accent-hover transition-all-300 flex items-center justify-center z-50 hover-lift';
        toggleBtn.innerHTML = '<i class="fas fa-robot text-2xl"></i>';
        toggleBtn.onclick = () => this.toggleChat();
        document.body.appendChild(toggleBtn);

        // Create Chat Container
        this.container = document.createElement('div');
        this.container.id = 'chatbot-container';
        this.container.className = 'fixed bottom-24 right-6 w-[350px] h-[500px] bg-bg-surface border border-border rounded-2xl shadow-2xl z-50 flex flex-col hidden overflow-hidden transform scale-95 transition-all duration-300 origin-bottom-right';

        document.body.appendChild(this.container);
        this.renderChatState();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.container.classList.remove('hidden');
            // Small delay for animation
            setTimeout(() => {
                this.container.classList.remove('scale-95', 'opacity-0');
                this.container.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.getElementById('chat-input')?.focus();
        } else {
            this.container.classList.remove('scale-100', 'opacity-100');
            this.container.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                this.container.classList.add('hidden');
            }, 300);
        }
    }

    renderChatState() {
        let chatMessagesHTML = '';
        if (this.chatHistory.length === 0) {
            chatMessagesHTML = `
                <div class="text-center text-text-secondary mt-10">
                    <i class="fas fa-magic text-3xl mb-2 text-primary/50"></i>
                    <p>How can I help you today?</p>
                </div>
            `;
        } else {
            chatMessagesHTML = this.chatHistory.map(msg => this.getMessageHTML(msg)).join('');
        }

        this.container.innerHTML = `
            <div class="p-4 bg-primary text-white flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <h3 class="font-bold"><i class="fas fa-robot mr-2"></i> EduBot AI</h3>
                    <span class="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">Gemini</span>
                </div>
                <div class="flex gap-3 text-sm">
                    <button class="hover:text-gray-200" onclick="document.getElementById('chatbot-toggle').click()"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div id="chat-messages" class="p-4 flex-1 overflow-y-auto bg-bg-primary space-y-4 text-sm custom-scrollbar">
                ${chatMessagesHTML}
            </div>
            <div class="p-3 border-t border-border bg-bg-surface flex gap-2">
                <input type="text" id="chat-input" placeholder="Ask something..." class="flex-1 px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                <button id="send-btn" class="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-accent-hover transition-colors shadow-sm">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        setTimeout(() => {
            const input = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');
            const messagesDiv = document.getElementById('chat-messages');

            if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;

            const sendMessage = async () => {
                const text = input.value.trim();
                if (!text) return;

                // Add user message
                input.value = '';
                this.addMessage('user', text);

                // Show typing indicator
                const typingId = this.addTypingIndicator();

                try {
                    const response = await this.callGeminiAPI(text);
                    this.removeMessage(typingId);
                    this.addMessage('bot', response);
                } catch (err) {
                    this.removeMessage(typingId);
                    this.addMessage('error', err.message);
                }
            };

            if (sendBtn) sendBtn.onclick = sendMessage;
            if (input) input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
        }, 0);
    }

    getMessageHTML(msg) {
        if (msg.role === 'user') {
            return `
                <div class="flex justify-end fade-in" id="${msg.id}">
                    <div class="bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                        ${msg.content}
                    </div>
                </div>
            `;
        } else if (msg.role === 'bot') {
            // Very simple markdown bold parser
            const formatted = msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            return `
                <div class="flex justify-start fade-in" id="${msg.id}">
                    <div class="bg-bg-surface border border-border text-text-primary px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                        ${formatted}
                    </div>
                </div>
            `;
        } else if (msg.role === 'error') {
            return `
                <div class="flex justify-start fade-in" id="${msg.id}">
                    <div class="bg-danger/10 border border-danger/20 text-danger px-4 py-2 rounded-2xl rounded-tl-sm max-w-[85%] text-xs font-medium">
                        <i class="fas fa-exclamation-circle mr-1"></i> ${msg.content}
                    </div>
                </div>
            `;
        }
    }

    addMessage(role, content) {
        const id = 'msg-' + Date.now();
        this.chatHistory.push({ id, role, content });
        this.renderChatState();
        return id;
    }

    removeMessage(id) {
        this.chatHistory = this.chatHistory.filter(m => m.id !== id);
        this.renderChatState();
    }

    addTypingIndicator() {
        const id = 'typing-' + Date.now();
        this.chatHistory.push({
            id,
            role: 'bot',
            content: '<div class="flex gap-1 items-center h-4"><div class="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div><div class="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style="animation-delay: 0.2s"></div></div>'
        });
        this.renderChatState();
        return id;
    }

    async callGeminiAPI(prompt) {
        if (!this.apiKey || this.apiKey === "YOUR_API_KEY_HERE") {
            throw new Error("Please add your API key in chatbot.js");
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${this.apiKey}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "You are EduBot, a helpful AI assistant for a classroom management system. Keep answers brief and helpful. " + prompt }] }]
                })
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error');
            }

            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No response generated.');
            }
        } catch (err) {
            console.error("Gemini Error:", err);
            throw new Error(err.message || 'Failed to connect to AI.');
        }
    }
}

let chatbot;
function initChatbot() {
    // Check localStorage directly to see if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        chatbot = new EduChatbot();
    }
}

// Ensure it runs even if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
