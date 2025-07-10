import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiSend,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiZap,
  FiMessageCircle,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiShare,
} from "react-icons/fi";

const ChatInterface = ({
  currentChat,
  onSendMessage,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ChatGPT");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  const models = [
    { id: "gpt-4", name: "ChatGPT", description: "Great for most tasks" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Faster responses" },
    { id: "gpt-3.5", name: "GPT-3.5", description: "Quick and efficient" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const message = {
        id: Date.now(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      onSendMessage(message);
      setInputValue("");
      setIsTyping(true);

      // Stop typing indicator when response comes
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerateResponse = (messageId) => {
    // In a real implementation, this would regenerate the AI response
    console.log("Regenerating response for message:", messageId);
  };

  const handleShareMessage = (content) => {
    if (navigator.share) {
      navigator.share({
        title: "ChatGPT Message",
        text: content,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div className={`chat-interface ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
      <div className="chat-header">
        <div className="model-dropdown" ref={dropdownRef}>
          <button
            className="model-dropdown-trigger"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          >
            <span className="model-name">{selectedModel}</span>
            <FiChevronDown
              size={16}
              className={`dropdown-arrow ${isModelDropdownOpen ? "open" : ""}`}
            />
          </button>

          {isModelDropdownOpen && (
            <div className="model-dropdown-menu">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`model-option ${
                    selectedModel === model.name ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedModel(model.name);
                    setIsModelDropdownOpen(false);
                  }}
                >
                  <div className="model-option-name">{model.name}</div>
                  <div className="model-option-description">
                    {model.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-right">
          <button className="temporary-chat-btn" title="Turn on temporary chat">
            <FiMessageCircle size={16} />
          </button>

          <div className="account-dropdown" ref={accountDropdownRef}>
            <button
              className="account-dropdown-trigger"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            >
              <div className="account-avatar">D</div>
            </button>

            {isAccountDropdownOpen && (
              <div className="account-dropdown-menu">
                <div className="account-info">
                  <FiUser size={16} />
                  <span>dmitriyuzat@gmail.com</span>
                </div>

                <div className="dropdown-divider"></div>

                <div className="account-menu-item">
                  <FiZap size={16} />
                  <span>Upgrade plan</span>
                </div>

                <div className="account-menu-item">
                  <FiSettings size={16} />
                  <span>Customize ChatGPT</span>
                </div>

                <div className="account-menu-item">
                  <FiSettings size={16} />
                  <span>Settings</span>
                </div>

                <div className="dropdown-divider"></div>

                <div className="account-menu-item">
                  <FiHelpCircle size={16} />
                  <span>Help</span>
                  <FiChevronRight size={16} className="menu-arrow" />
                </div>

                <div className="account-menu-item">
                  <FiLogOut size={16} />
                  <span>Log out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {!currentChat || currentChat.messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-cat">🐱</div>
            <h1 className="welcome-title">Chat with MeowGPT</h1>
            <p className="welcome-subtitle">
              Ask me anything and I'll respond with meows! 🐾
            </p>
          </div>
        ) : (
          <>
            {currentChat.messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === "user" ? (
                  <div className="user-message-container">
                    <div className="user-message-bubble">{message.content}</div>
                  </div>
                ) : (
                  <div className="message-container">
                    <div className={`message-avatar ${message.sender}`}>
                      <span className="ai-avatar">🐱</span>
                    </div>
                    <div className="message-content-wrapper">
                      <div className="message-content">{message.content}</div>
                      <div className="message-actions">
                        <button
                          className="action-btn"
                          onClick={() => handleCopyMessage(message.content)}
                          title="Copy"
                        >
                          <FiCopy size={14} />
                        </button>
                        <button className="action-btn" title="Good response">
                          <FiThumbsUp size={14} />
                        </button>
                        <button className="action-btn" title="Bad response">
                          <FiThumbsDown size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleRegenerateResponse(message.id)}
                          title="Regenerate"
                        >
                          <FiRefreshCw size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleShareMessage(message.content)}
                          title="Share"
                        >
                          <FiShare size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <div className="message-container">
                  <div className="message-avatar ai">
                    <span className="ai-avatar">🐱</span>
                  </div>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Ask anything"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button
              type="submit"
              className="send-button"
              disabled={!inputValue.trim()}
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
        <div className="chat-info-text">
          ChatGPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
