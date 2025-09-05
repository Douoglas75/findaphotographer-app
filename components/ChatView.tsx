import React, { useState, useEffect, useRef } from 'react';
import type { MessageThread, User, ChatMessage } from '../types';
import { generateChatSuggestion } from '../services/geminiService';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';

interface ChatViewProps {
  thread: MessageThread;
  otherUser: User;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ thread, otherUser, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);
  const [newMessage, setNewMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSuggestions([]); // Clear suggestions after sending a message
  };
  
  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    const generatedSuggestions = await generateChatSuggestion(currentUser.type, otherUser.type);
    setSuggestions(generatedSuggestions);
    setIsSuggesting(false);
  };

  const useSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
    setSuggestions([]);
  }

  return (
    <div className="flex flex-col h-full animate-fade-in bg-gray-900">
      <header className="flex items-center p-3 border-b border-gray-800/50 flex-shrink-0 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700/50">
           &larr;
        </button>
        <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover ml-3" />
        <div className="ml-3">
          <h2 className="font-bold text-lg text-white">{otherUser.name}</h2>
          <p className="text-xs text-gray-400">En ligne</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== currentUser.id && (
              <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            )}
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-cyan-600 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'}`}>
              <p>{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block text-right">{msg.timestamp}</span>
            </div>
             {msg.senderId === currentUser.id && (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                  <button key={i} onClick={() => useSuggestion(s)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded-full transition-colors">
                      {s}
                  </button>
              ))}
          </div>
      )}

      <footer className="p-3 border-t border-gray-800/50 bg-gray-950 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetSuggestions}
              disabled={isSuggesting}
              className="p-2 rounded-full text-purple-400 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
              aria-label="Obtenir des suggestions de message"
            >
              {isSuggesting ? (
                 <div className="w-6 h-6 animate-spin rounded-full border-2 border-purple-400 border-t-transparent"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l.707.707M19 12a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              )}
            </button>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-gray-800 rounded-full py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button type="submit" className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-full transition-colors text-white disabled:bg-gray-600" disabled={!newMessage.trim()}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatView;