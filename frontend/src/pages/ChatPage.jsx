import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import ThemeSelector from '../components/ThemeSelector';
import { LogOut, Send } from 'lucide-react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('chat-username');
    if (!name) {
      navigate('/');
    } else {
      setUserName(name);
      connect(name);
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connect = (name) => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: function (str) {
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = async function (frame) {
      client.subscribe('/topic/public', (message) => {
        const payload = JSON.parse(message.body);
        setMessages((prev) => {
          return [...prev, payload];
        });
      });

      client.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: name, type: 'JOIN' })
      });

      try {
        const response = await fetch("http://localhost:8080/api/chat/messages");
        if(response.ok) {
          const data = await response.json();
          setMessages(prev => [...data, ...prev.filter(m => m.type === 'JOIN' && m.sender === name)]);
        }
      } catch (err) {
        console.error("Could not fetch old messages:", err);
      }
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    stompClient.current = client;
  };

  const sendMessage = (e) => {
    e?.preventDefault();
    if (inputMessage.trim() && stompClient.current?.connected) {
      const chatMessage = {
        sender: userName,
        content: inputMessage.trim(),
        type: 'CHAT'
      };
      
      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage)
      });
      
      setInputMessage('');
    }
  };

  const handleLogout = () => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: userName, type: 'LEAVE' })
      });
      stompClient.current.deactivate();
    }
    localStorage.removeItem('chat-username');
    navigate('/');
  };



  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div className="chat-brand">
          <img src={logo} alt="Ping Logo" className="chat-logo" />
          <h2 className="chat-title">Ping</h2>
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
        <div className="chat-sidebar">
          <h3 className="section-title">Channels</h3>
          <ul className="channel-list">
            <li className="active"># general</li>
            <li># random</li>
          </ul>
        </div>
        <div className="chat-window">
          <div className="message-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type !== 'CHAT' ? 'system' : ''}`}>
                {msg.type === 'JOIN' && `${msg.sender} joined!`}
                {msg.type === 'LEAVE' && `${msg.sender} left!`}
                {msg.type === 'CHAT' && (
                  <>
                    <strong>{msg.sender}: </strong>
                    <span>{msg.content}</span>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="message-input-container">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="message-input base-input" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="send-btn base-button" disabled={!inputMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
