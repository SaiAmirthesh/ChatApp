import { useEffect, useState, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useChat = (userName) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stompClient = useRef(null);

  const connect = useCallback((name) => {
    if (!name) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: async (frame) => {
        setIsConnected(true);
        setIsLoading(false);
        
        client.subscribe('/topic/public', (message) => {
          const payload = JSON.parse(message.body);
          setMessages((prev) => [...prev, payload]);
        });

        client.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({ sender: name, type: 'JOIN' })
        });

        // Fetch history
        try {
          const response = await fetch(`${BACKEND_URL}/api/chat/messages`);
          if (response.ok) {
            const data = await response.json();
            setMessages(prev => [...data, ...prev.filter(m => m.type === 'JOIN' && m.sender === name)]);
          }
        } catch (err) {
          console.error("Could not fetch old messages:", err);
        }
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        setIsConnected(false);
      }
    });

    client.activate();
    stompClient.current = client;
  }, []);

  useEffect(() => {
    if (userName) {
      connect(userName);
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userName, connect]);

  const sendMessage = useCallback((content) => {
    if (content.trim() && stompClient.current?.connected) {
      const chatMessage = {
        sender: userName,
        content: content.trim(),
        type: 'CHAT',
        timestamp: new Date().toISOString()
      };
      
      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage)
      });
    }
  }, [userName]);

  const sendLeave = useCallback(() => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ sender: userName, type: 'LEAVE' })
      });
    }
  }, [userName]);

  return { messages, isConnected, isLoading, sendMessage, sendLeave };
};
