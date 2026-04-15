import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Plus } from 'lucide-react';
import './ProposalDrafter.css';
import { generateTextOnly } from '../../services/api';

const ProposalDrafter = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const newUserMessage = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send raw user input — backend detects intent (chat vs proposal)
      const data = await generateTextOnly(userText);
      const aiResponse = {
        id: Date.now() + 1,
        text: data.output || 'Error generating content. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const errResponse = {
        id: Date.now() + 1,
        text: 'Error generating content. Please try again.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="proposal-container">
      <div className="proposal-sidebar">
        <button className="back-btn-small" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        
        <div className="sidebar-section">
          <button className="suggestion-btn" onClick={() => setInput("Draft a proposal for a new mobile app")}>
            Draft App Proposal
          </button>
          <button className="suggestion-btn" onClick={() => setInput("Write an executive summary for marketing")}>
            Marketing Summary
          </button>
          <button className="suggestion-btn" onClick={() => setInput("Outline a budget plan for 2026")}>
            Budget Strategy
          </button>
        </div>

        <button className="new-chat-btn" onClick={() => setMessages([])}>
          NewChat <Plus size={20} />
        </button>

        {messages.length > 0 && (
          <div className="history-section">
            <h3>Watch History</h3>
            <div className="history-list">
              <div className="history-item">{messages[0]?.text.slice(0, 20)}...</div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <h1>SuDOCU</h1>
        </div>

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`} style={{whiteSpace: 'pre-wrap'}}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="message-bubble ai">Thinking...</div>
          )}
          {messages.length === 0 && !loading && (
            <div className="chat-placeholder">
              <h2>Start a conversation with SuDOCU</h2>
              <p>Discuss your ideas to generate a stunning proposal.</p>
            </div>
          )}
          {messages.length > 0 && (
            <p style={{textAlign: 'center', fontSize: '0.75em', opacity: 0.5, marginTop: '8px'}}>Note: The generated content may not be fully accurate. Please review and verify before use.</p>
          )}
        </div>

        <div className="chat-input-wrapper">
          <div className="chat-input-box">
            <input 
              type="text" 
              placeholder="Write Your Ideas" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="input-actions">
              <button className="send-btn" onClick={handleSend}><Send size={24} /></button>
              <button className="attach-btn"><Plus size={24} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDrafter;
