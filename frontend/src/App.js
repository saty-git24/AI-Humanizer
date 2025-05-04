import React, { useState } from 'react';
import { Send, MessageSquare, User, Cpu } from 'react-feather';
import './App.css';
import axios from 'axios'; 

function App() {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]);

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/paraphrase', {
        text: inputText
      });

    // Dummy paraphrasing (reverse text)
    setHistory([...history, { input: inputText, output: response.data.paraphrased_text}]);
    setInputText('');
  }catch (error) {
    console.error('Error while paraphrasing:', error);
    setHistory([...history, { input: inputText, output: 'Error connecting to server.' }]);
    setInputText('');
  }
};

  return (
    <div className="container">
      {/* Top Header */}
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

      {/* Blocks Wrapper */}
      <div className="blocks-wrapper">
        {/* Output Block (Chat History) */}
        <div className="chat-block">
          {history.map((item, index) => (
            <div key={index} className="chat-message">
              <div className="message right">{item.input}</div>
              <div className="message left">{item.output}</div>
            </div>
          ))}
        </div>

        {/* Input Block (Textarea + Button) */}
        <div className="input-block">
          <textarea
            className="form-control mb-3 custom-textarea"
            placeholder="Enter text to paraphrase..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="4"
          />
          <button className="btn custom-btn" onClick={handleParaphrase}>
            Paraphrase <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
