import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import ThemeSelector from '../components/ThemeSelector';
import { LogOut, Send, Hash } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const storedName = localStorage.getItem('chat-username');
  
  useEffect(() => {
    if (!storedName) {
      navigate('/');
    } else {
      setUserName(storedName);
    }
  }, [storedName, navigate]);

  const { messages, isConnected, isLoading, sendMessage, sendLeave } = useChat(storedName);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleLogout = () => {
    sendLeave();
    localStorage.removeItem('chat-username');
    navigate('/');
  };

  const formatTime = (isoString) => {
    if (!isoString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div className="chat-brand">
          <img src={logo} alt="Ping Logo" className="chat-logo" />
          <h2 className="chat-title">Ping</h2>
          <div className="status-indicator ml-4">
            <span className={`status-dot ${isConnected ? 'connected' : ''}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
        <div className="chat-actions">
          <span className="welcome-text">Welcome, {userName}</span>
          <ThemeSelector />
          <button onClick={handleLogout} className="icon-btn base-button" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="chat-main">
        <aside className="chat-sidebar">
          <h3 className="section-title">Channels</h3>
          <div className="active-channel">
            <Hash size={18} />
            <span>general</span>
          </div>
          <p className="text-xs text-muted mt-4 font-medium opacity-60">MORE CHANNELS COMING SOON</p>
        </aside>

        <div className="chat-window">
          {isLoading && (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p className="font-medium animate-pulse">Syncing messages...</p>
            </div>
          )}

          <div className="message-list">
            {messages.map((msg, index) => {
              const isOwn = msg.sender === userName;
              const isSystem = msg.type !== 'CHAT';

              if (isSystem) {
                return (
                  <div key={index} className="message system">
                    {msg.type === 'JOIN' ? `${msg.sender} joined the conversation` : `${msg.sender} left the chat`}
                  </div>
                );
              }

              return (
                <div key={index} className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
                  {!isOwn && <span className="message-sender">{msg.sender}</span>}
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-input-container">
            <input 
              type="text" 
              placeholder={isConnected ? "Message #general" : "Connecting to server..."}
              className="message-input base-input" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={!isConnected}
            />
            <button 
              type="submit" 
              className="send-btn base-button" 
              disabled={!inputMessage.trim() || !isConnected}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
