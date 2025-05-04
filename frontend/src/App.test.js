import { Send, MessageSquare, User, Cpu } from 'react-feather';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]);

  const handleParaphrase = () => {
    if (!inputText.trim()) return;

    const paraphrased = `Paraphrased: ${inputText.split('').reverse().join('')}`;
    setHistory([...history, { input: inputText, output: paraphrased }]);
    setInputText('');
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="heading-icon">
          <MessageSquare size={32} style={{ marginRight: '10px', color: '#1F1F1F' }} />
          AI HUMANIZER
        </h1>
        <div className="top-icons">
          <User className="icon-style me-3" size={28} />
          <Cpu className="icon-style" size={28} />
        </div>
      </div>

      {/* Blocks Wrapper with background */}
      <div className="blocks-wrapper">
        {/* Output / Chat Block */}
        <div className="custom-block chat-block mb-4">
          {history.map((item, index) => (
            <div key={index} className="chat-message">
              <div className="message left">{item.output}</div>
              <div className="message right">{item.input}</div>
            </div>
          ))}
        </div>

        {/* Full-width Input Block (Block 1) */}
        <div className="custom-block input-block">
          <textarea
            className="form-control mb-3 custom-textarea"
            placeholder="Enter text to paraphrase..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="5"
          />
          <button className="btn custom-btn" onClick={handleParaphrase}>
            <Send size={16} className="me-2" />
            Paraphrase
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
