import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiChevronDown,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiZap,
  FiGithub,
  FiMessageCircle,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiShare,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useTranslation } from "../translations";

const ChatInterface = ({
  currentChat,
  onSendMessage,
  isSidebarOpen,
  onToggleSidebar,
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}) => {
  const { t } = useTranslation(language);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("MeowGPT");
  const [messageRatings, setMessageRatings] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const settingsModalRef = useRef(null);

  const models = [
    {
      id: "gpt-4",
      name: t("models.MeowGPT"),
      description: t("modelDescriptions.MeowGPT"),
    },
    {
      id: "gpt-4-turbo",
      name: t("models.MeowGPT Turbo"),
      description: t("modelDescriptions.MeowGPT Turbo"),
    },
    {
      id: "gpt-3.5",
      name: t("models.MeowGPT Mini"),
      description: t("modelDescriptions.MeowGPT Mini"),
    },
  ];

  const themes = [
    { id: "light", name: t("themes.light") },
    { id: "dark", name: t("themes.dark") },
    { id: "system", name: t("themes.system") },
  ];

  const languages = [
    { id: "en", name: t("languages.en") },
    { id: "ru", name: t("languages.ru") },
    { id: "uk", name: t("languages.uk") },
    { id: "sk", name: t("languages.sk") },
    { id: "pl", name: t("languages.pl") },
    { id: "sim", name: t("languages.sim") },
    { id: "meow", name: t("languages.meow") },
    { id: "twink", name: t("languages.twink") },
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
      if (
        settingsModalRef.current &&
        !settingsModalRef.current.contains(event.target) &&
        event.target.classList.contains("settings-modal-overlay")
      ) {
        setIsSettingsModalOpen(false);
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
        timestamp: Date.now(), // Use timestamp instead of Date object
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
        title: "MeowGPT Message",
        text: content,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(content);
    }
  };

  const handleRateMessage = (messageId, rating) => {
    setMessageRatings((prev) => {
      const newRatings = { ...prev };

      // If clicking the same rating, remove it
      if (newRatings[messageId] === rating) {
        delete newRatings[messageId];
      } else {
        // Otherwise, set the new rating (this automatically overrides any previous rating)
        newRatings[messageId] = rating;
      }

      return newRatings;
    });
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
    setIsAccountDropdownOpen(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
  };

  const handleThemeChangeLocal = (newTheme) => {
    onThemeChange(newTheme);
  };

  const handleLanguageChangeLocal = (newLanguage) => {
    onLanguageChange(newLanguage);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    // Swipe right to open sidebar (when closed)
    if (distance < -minSwipeDistance && !isSidebarOpen) {
      onToggleSidebar();
    }

    // Swipe left to close sidebar (when open)
    if (distance > minSwipeDistance && isSidebarOpen) {
      onToggleSidebar();
    }
  };

  // Mobile input focus handler
  const handleInputFocus = () => {
    // Close sidebar on mobile when input gets focus
    if (window.innerWidth <= 768 && isSidebarOpen) {
      onToggleSidebar();
    }
  };

  return (
    <div
      className={`chat-interface ${!isSidebarOpen ? "sidebar-closed" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="chat-header">
        <div className="header-left">
          <button
            className="hamburger-menu mobile-only"
            onClick={onToggleSidebar}
            title="Toggle menu"
          >
            <FiMenu size={20} />
          </button>

          <div className="model-dropdown" ref={dropdownRef}>
            <button
              className="model-dropdown-trigger"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            >
              <span className="model-name">{selectedModel}</span>
              <FiChevronDown
                size={16}
                className={`dropdown-arrow ${
                  isModelDropdownOpen ? "open" : ""
                }`}
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
        </div>

        <div className="header-right">
          <button className="temporary-chat-btn" title={t("temporaryChat")}>
            <FiMessageCircle size={16} />
          </button>

          <div className="account-dropdown" ref={accountDropdownRef}>
            <button
              className="account-dropdown-trigger"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            >
              <div className="account-avatar">A</div>
            </button>

            {isAccountDropdownOpen && (
              <div className="account-dropdown-menu">
                <div className="account-info">
                  <FiGithub size={16} />
                  <a
                    href="https://github.com/dmitthedazed"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {t("madeBy")}
                  </a>
                </div>

                <div className="dropdown-divider"></div>

                <div className="account-menu-item">
                  <FiZap size={16} />
                  <span>{t("upgradePlan")}</span>
                </div>

                <div className="account-menu-item" onClick={handleOpenSettings}>
                  <FiSettings size={16} />
                  <span>{t("settings")}</span>
                </div>

                <div className="dropdown-divider"></div>

                <div className="account-menu-item">
                  <FiHelpCircle size={16} />
                  <span>{t("help")}</span>
                  <FiChevronRight size={16} className="menu-arrow" />
                </div>

                <div className="account-menu-item">
                  <FiLogOut size={16} />
                  <span>{t("logOut")}</span>
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
            <h1 className="welcome-title">{t("welcomeTitle")}</h1>
            <p className="welcome-subtitle">{t("welcomeSubtitle")}</p>
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
                          title={t("copy")}
                        >
                          <FiCopy size={14} />
                        </button>
                        <button
                          className={`action-btn ${
                            messageRatings[message.id] === "thumbsUp"
                              ? "active"
                              : ""
                          }`}
                          title={t("goodResponse")}
                          onClick={() =>
                            handleRateMessage(message.id, "thumbsUp")
                          }
                        >
                          {messageRatings[message.id] === "thumbsUp" ? (
                            <AiFillLike size={14} />
                          ) : (
                            <FiThumbsUp size={14} />
                          )}
                        </button>
                        <button
                          className={`action-btn ${
                            messageRatings[message.id] === "thumbsDown"
                              ? "active"
                              : ""
                          }`}
                          title={t("badResponse")}
                          onClick={() =>
                            handleRateMessage(message.id, "thumbsDown")
                          }
                        >
                          {messageRatings[message.id] === "thumbsDown" ? (
                            <AiFillDislike size={14} />
                          ) : (
                            <FiThumbsDown size={14} />
                          )}
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleRegenerateResponse(message.id)}
                          title={t("regenerate")}
                        >
                          <FiRefreshCw size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleShareMessage(message.content)}
                          title={t("share")}
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
              placeholder={t("messagePlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
              onFocus={handleInputFocus} // Close sidebar on input focus
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
        <div className="chat-info-text">{t("disclaimer")}</div>
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="settings-modal-overlay" onClick={handleCloseSettings}>
          <div
            ref={settingsModalRef}
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-modal-header">
              <h2>{t("settingsTitle")}</h2>
              <button
                className="settings-close-btn"
                onClick={handleCloseSettings}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="settings-modal-content">
              <div className="settings-section">
                <h3>{t("appearance")}</h3>
                <div className="settings-item">
                  <label>{t("theme")}</label>
                  <select
                    className="settings-select"
                    value={theme}
                    onChange={(e) => handleThemeChangeLocal(e.target.value)}
                  >
                    {themes.map((themeOption) => (
                      <option key={themeOption.id} value={themeOption.id}>
                        {themeOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>{t("general")}</h3>
                <div className="settings-item">
                  <label>{t("language")}</label>
                  <select
                    className="settings-select"
                    value={language}
                    onChange={(e) => handleLanguageChangeLocal(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
