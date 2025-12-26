import React, { useState, useEffect } from 'react';

export default function   Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Added a welcome message that appears when the chatbot is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          { 
            text: "Hey there! 👋 I'm MoodTunes, your personal music mood assistant. Tell me how you're feeling, and I'll suggest some songs that match your vibe!", 
            sender: 'bot' 
          }
        ]);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setInput('');
      // Show typing indicator
      setIsTyping(true);
      
      // Generate response with a slight delay to simulate thinking
      setTimeout(() => {
        setIsTyping(false);
        const userInput = userMessage.toLowerCase();
        let response = '';
        
        // Check for greetings
        if (userInput.match(/^(hi|hello|hey|howdy|hola|sup)/i)) {
          response = "Hello there! How are you feeling today? I can suggest music based on your mood!";
        } 
        // Check for gratitude
        else if (userInput.match(/(thanks|thank you|thx)/i)) {
          response = "You're welcome! Enjoy the music. Let me know if you need more recommendations!";
        }
        // Check for goodbye
        else if (userInput.match(/(bye|goodbye|see ya|cya|farewell)/i)) {
          response = "Goodbye! Feel free to come back whenever you need music recommendations!";
        }
        // Check for mood keywords
        else if (userInput.includes('happy') || userInput.includes('joy') || userInput.includes('excited') || userInput.includes('good')) {
          response = "Based on your happy mood, try these upbeat songs:\n\n1. 'Walking on Sunshine' by Katrina & The Waves\n2. 'Happy' by Pharrell Williams\n3. 'Can't Stop the Feeling!' by Justin Timberlake\n4. 'Good as Hell' by Lizzo\n5. 'Uptown Funk' by Mark Ronson ft. Bruno Mars";
        } 
        else if (userInput.includes('sad') || userInput.includes('down') || userInput.includes('depressed') || userInput.includes('blue')) {
          response = "For your melancholy mood, these might resonate:\n\n1. 'Someone Like You' by Adele\n2. 'Fix You' by Coldplay\n3. 'Everybody Hurts' by R.E.M.\n4. 'Hurt' by Johnny Cash\n5. 'All I Want' by Kodaline";
        } 
        else if (userInput.includes('relax') || userInput.includes('calm') || userInput.includes('chill') || userInput.includes('peaceful')) {
          response = "To enhance your relaxed state, try:\n\n1. 'Weightless' by Marconi Union\n2. 'Clair de Lune' by Debussy\n3. 'Waves' by Ludovico Einaudi\n4. 'Breathe' by Télépopmusik\n5. 'Porcelain' by Moby";
        } 
        else if (userInput.includes('energetic') || userInput.includes('workout') || userInput.includes('pump') || userInput.includes('hyped')) {
          response = "To keep your energy high:\n\n1. 'Eye of the Tiger' by Survivor\n2. 'Till I Collapse' by Eminem\n3. 'Stronger' by Kanye West\n4. 'Power' by Kanye West\n5. 'Black Skinhead' by Kanye West";
        } 
        else if (userInput.includes('romantic') || userInput.includes('love') || userInput.includes('passion')) {
          response = "For romantic vibes:\n\n1. 'Perfect' by Ed Sheeran\n2. 'All of Me' by John Legend\n3. 'At Last' by Etta James\n4. 'Can't Help Falling in Love' by Elvis Presley\n5. 'Make You Feel My Love' by Adele";
        }
        else if (userInput.includes('angry') || userInput.includes('mad') || userInput.includes('furious')) {
          response = "For those angry moments:\n\n1. 'Break Stuff' by Limp Bizkit\n2. 'Killing In The Name' by Rage Against The Machine\n3. 'Given Up' by Linkin Park\n4. 'Platypus (I Hate You)' by Green Day\n5. 'Bodies' by Drowning Pool";
        }
        else if (userInput.includes('nostalgic') || userInput.includes('memory') || userInput.includes('memories')) {
          response = "For nostalgic feelings:\n\n1. '1979' by The Smashing Pumpkins\n2. 'Landslide' by Fleetwood Mac\n3. 'Good Riddance (Time of Your Life)' by Green Day\n4. 'In My Life' by The Beatles\n5. 'Vienna' by Billy Joel";
        }
        else if (userInput.includes('anxious') || userInput.includes('anxiety') || userInput.includes('stressed')) {
          response = "To help with anxiety and stress:\n\n1. 'Breathe Me' by Sia\n2. 'Weightless' by Marconi Union\n3. 'Orinoco Flow' by Enya\n4. 'Gymnopédie No.1' by Erik Satie\n5. 'Everything's Not Lost' by Coldplay";
        }
        // Help or information requests
        else if (userInput.match(/(help|how|what can you do|about)/i)) {
          response = "I'm MoodTunes, your music recommendation assistant! Just tell me your current mood (happy, sad, energetic, relaxed, etc.), and I'll suggest songs that match how you're feeling. You can also ask for specific genres or activities like 'workout music' or 'study music'.";
        }
        // Out of context responses
        else {
          response = "I'm sorry, that seems to be outside my context. I'm a music recommendation bot that suggests songs based on your mood. Try telling me if you're feeling happy, sad, energetic, relaxed, romantic, or something similar!";
        }
        
        setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  // Scroll to bottom of messages when new message appears
  useEffect(() => {
    const messagesDiv = document.querySelector('.messages');
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChatbox}>
        <div className="robot-icon">
          <div className="antenna"></div>
          <div className="head">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <div className="bot-avatar">
              <div className="mini-robot">
                <div className="mini-antenna"></div>
                <div className="mini-head">
                  <div className="mini-eye left"></div>
                  <div className="mini-eye right"></div>
                </div>
              </div>
            </div>
            <div className="header-text">
              <div className="bot-name">MoodTunes</div>
              <div className="bot-status">Music Recommender</div>
            </div>
            <div className="close-btn" onClick={toggleChatbox}>×</div>
          </div>
          
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>
          
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me your mood..."
            />
            <button onClick={handleSend}>
              <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: 'Roboto', sans-serif;
        }
        
        .chatbot-toggle {
          cursor: pointer;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          animation: pulse 2s infinite;
        }
        
        .chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        
        .chatbot-toggle.open {
          transform: scale(0.9);
          animation: none;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(174, 123, 227, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(174, 123, 227, 0); }
          100% { box-shadow: 0 0 0 0 rgba(174, 123, 227, 0); }
        }
        
        /* Robot Icon Styles */
        .robot-icon {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .antenna {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 12px;
          background-color: #fff;
          border-radius: 6px 6px 0 0;
        }
        
        .head {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          overflow: hidden;
        }
        
        .eye {
          width: 10px;
          height: 10px;
          background-color: #333;
          border-radius: 50%;
          animation: blink 4s infinite;
        }
        
        @keyframes blink {
          0%, 45%, 50%, 55%, 100% { transform: scaleY(1); }
          47.5%, 52.5% { transform: scaleY(0.1); }
        }
        
        /* Chatbot Window Styles */
        .chatbot {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s forwards;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .chatbot-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
        }
        
        .bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: white;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mini-robot {
          position: relative;
          width: 20px;
          height: 20px;
        }
        
        .mini-antenna {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 5px;
          background-color: #a777e3;
          border-radius: 3px 3px 0 0;
        }
        
        .mini-head {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #a777e3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
        
        .mini-eye {
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        }
        
        .header-text {
          flex: 1;
        }
        
        .bot-name {
          font-weight: 600;
          font-size: 16px;
        }
        
        .bot-status {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .close-btn {
          font-size: 24px;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        
        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          max-height: 350px;
          background-color: #f7f9fb;
        }
        
        .message {
          margin-bottom: 12px;
          max-width: 85%;
          word-wrap: break-word;
          animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message p {
          margin: 0 0 5px 0;
          line-height: 1.4;
        }
        
        .message.user {
          margin-left: auto;
          background-color: #6e8efb;
          color: white;
          border-radius: 16px 16px 0 16px;
          padding: 10px 14px;
        }
        
        .message.bot {
          background-color: #e6e9f0;
          color: #333;
          border-radius: 16px 16px 16px 0;
          padding: 10px 14px;
        }
        
        .typing {
          display: flex;
          align-items: center;
          padding: 10px 14px;
        }
        
        .dot {
          width: 6px;
          height: 6px;
          background-color: #999;
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.5s infinite ease-in-out;
        }
        
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        
        .input-area {
          display: flex;
          align-items: center;
          padding: 12px;
          border-top: 1px solid #eaeaea;
        }
        
        .input-area input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #ddd;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: border 0.3s;
        }
        
        .input-area input:focus {
          border-color: #6e8efb;
        }
        
        .input-area button {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
          border-radius: 50%;
          margin-left: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        
        .input-area button:hover {
          transform: scale(1.1);
        }
        
        .send-icon {
          width: 18px;
          height: 18px;
        }
      `}</style>
    </div>
  );
}