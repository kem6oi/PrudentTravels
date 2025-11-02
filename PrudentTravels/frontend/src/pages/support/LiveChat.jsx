import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { HiPaperAirplane } from 'react-icons/hi';

const LiveChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'support', timestamp: new Date() }]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Live Chat" />
        
        <main className="p-8 h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="card flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>No active chats</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'support'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary px-6">
                  <HiPaperAirplane />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveChat;
