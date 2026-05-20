import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiChevronDown,
  FiMessageCircle,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiShare,
  FiMenu,
  FiCheck,
  FiImage,
  FiEdit2,
  FiGlobe,
  FiPlus,
  FiFileText,
  FiX,
  FiMic,
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
  isAiTyping = false,
  setIsAiTyping,
  onRegenerateResponse,
  onOpenSearch,
  onNewChat,
  isTemporaryMode = false,
  onToggleTemporaryMode,
  onOpenVoiceMode,
}) => {
  const { t } = useTranslation(language);
  const [inputValue, setInputValue] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("MeowGPT");
  const [messageRatings, setMessageRatings] = useState({});
  const [copiedMessages, setCopiedMessages] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAttachDropdownOpen, setIsAttachDropdownOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const attachDropdownRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

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
    { id: "brainrot", name: t("languages.brainrot") },
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
      if (attachDropdownRef.current && !attachDropdownRef.current.contains(event.target)) {
        setIsAttachDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileSelect = (type) => (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      type,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() || attachedFiles.length > 0) {
      const message = {
        id: Date.now(),
        content: inputValue,
        sender: "user",
        timestamp: Date.now(),
        attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      };

      onSendMessage(message);
      setInputValue("");
      setAttachedFiles([]);

      if (setIsAiTyping) {
        setIsAiTyping(true);
      }
    }
  };

  const handleSuggestionClick = (text) => {
    const message = {
      id: Date.now(),
      content: text,
      sender: "user",
      timestamp: Date.now(),
    };

    onSendMessage(message);

    if (setIsAiTyping) {
      setIsAiTyping(true);
    }
  };

  const suggestions = [
    { icon: <FiImage />, text: t("suggestionDrawCat") },
    { icon: <FiEdit2 />, text: t("suggestionMousePoem") },
    { icon: <FiGlobe />, text: t("suggestionCatsPurr") },
  ];

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
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + "px";
      textarea.style.overflowY = scrollHeight > 200 ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleCopyMessage = (content, messageId) => {
    navigator.clipboard.writeText(content);

    setCopiedMessages((prev) => ({
      ...prev,
      [messageId]: true,
    }));

    setTimeout(() => {
      setCopiedMessages((prev) => ({
        ...prev,
        [messageId]: false,
      }));
    }, 2000);
  };

  const handleRegenerateResponse = (messageId) => {
    if (onRegenerateResponse) {
      onRegenerateResponse(messageId);
    }
  };

  const handleShareMessage = (content) => {
    if (navigator.share) {
      navigator.share({
        title: "MeowGPT",
        text: content,
      });
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  const handleRateMessage = (messageId, rating) => {
    setMessageRatings((prev) => {
      const newRatings = { ...prev };
      if (newRatings[messageId] === rating) {
        delete newRatings[messageId];
      } else {
        newRatings[messageId] = rating;
      }
      return newRatings;
    });
  };

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

    if (distance < -minSwipeDistance && !isSidebarOpen) {
      onToggleSidebar();
    }

    if (distance > minSwipeDistance && isSidebarOpen) {
      onToggleSidebar();
    }
  };

  const handleInputFocus = () => {
    if (window.innerWidth <= 768 && isSidebarOpen) {
      onToggleSidebar();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`chat-interface ${!isSidebarOpen ? "sidebar-closed" : ""} ${!currentChat || currentChat.messages.length === 0 ? "is-empty" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="chat-header">
        <div className="header-left">
          <button
            className="hamburger-menu mobile-only"
            onClick={onToggleSidebar}
            title={t("toggleMenu")}
          >
            <FiMenu size={20} />
          </button>
        </div>

        <div className="header-right">
          <button
            className={`temporary-chat-btn${isTemporaryMode ? " active" : ""}`}
            title={t("temporaryChat")}
            onClick={onToggleTemporaryMode}
          >
            <FiMessageCircle size={16} />
          </button>
        </div>
      </div>

      {isTemporaryMode && (
        <div className="temporary-chat-banner">
          <FiMessageCircle size={14} />
          <span>
            {t("temporaryChat")} - {t("temporaryChatNotice")}
          </span>
        </div>
      )}

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
                    <div className="user-message-bubble">
                      {message.attachments?.map((att, i) =>
                        att.type === "image" ? (
                          <img
                            key={i}
                            src={att.url}
                            alt={att.name}
                            className="message-image"
                          />
                        ) : (
                          <div key={i} className="message-document-chip">
                            <FiFileText size={14} />
                            <div className="message-document-info">
                              <span className="message-document-name">{att.name}</span>
                              <span className="message-document-size">{formatFileSize(att.size)}</span>
                            </div>
                          </div>
                        )
                      )}
                      {message.content && (
                        <div className="message-text">{message.content}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="message-container">
                    <div className={`message-avatar ${message.sender}`}>
                      <span className="ai-avatar">🐱</span>
                    </div>
                    <div className="message-content-wrapper">
                      {message.isTyping ? (
                        <div className="typing-dots">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      ) : (
                        <div className="message-content">{message.content}</div>
                      )}
                      {!message.isTyping && (
                        <div className="message-actions">
                          <button
                            className={`action-btn ${
                              copiedMessages[message.id] ? "copy-success" : ""
                            }`}
                            onClick={() =>
                              handleCopyMessage(message.content, message.id)
                            }
                            title={
                              copiedMessages[message.id]
                                ? t("copied")
                                : t("copy")
                            }
                          >
                            {copiedMessages[message.id] ? (
                              <FiCheck size={14} />
                            ) : (
                              <FiCopy size={14} />
                            )}
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAiTyping && (
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
            {attachedFiles.length > 0 && (
              <div className="attachment-preview">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="attachment-preview-item">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="attachment-preview-thumb"
                      />
                    ) : (
                      <div className="attachment-preview-doc">
                        <FiFileText size={20} />
                        <span className="attachment-preview-name">{file.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="attachment-remove-btn"
                      onClick={() => removeAttachment(i)}
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="input-row">
              <div className="attach-dropdown-wrapper" ref={attachDropdownRef}>
                <button
                  type="button"
                  className="attach-btn"
                  onClick={() => setIsAttachDropdownOpen(!isAttachDropdownOpen)}
                  title={t("attachFile")}
                >
                  <FiPlus size={18} />
                </button>
                {isAttachDropdownOpen && (
                  <div className="attach-dropdown-menu">
                    <div
                      className="attach-option"
                      onClick={() => {
                        imageInputRef.current.click();
                        setIsAttachDropdownOpen(false);
                      }}
                    >
                      <FiImage size={16} />
                      <span>{t("attachImage")}</span>
                    </div>
                    <div
                      className="attach-option"
                      onClick={() => {
                        documentInputRef.current.click();
                        setIsAttachDropdownOpen(false);
                      }}
                    >
                      <FiFileText size={16} />
                      <span>{t("attachDocument")}</span>
                    </div>
                  </div>
                )}
              </div>

              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder={t("messagePlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
                onFocus={handleInputFocus}
              />
              <div className="input-actions">
                <div className="model-dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className="model-dropdown-trigger"
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  >
                    <span className="model-name">{selectedModel}</span>
                    <FiChevronDown
                      size={14}
                      className={`dropdown-arrow ${isModelDropdownOpen ? "open" : ""}`}
                    />
                  </button>

                  {isModelDropdownOpen && (
                    <div className="model-dropdown-menu model-dropdown-menu--up">
                      {models.map((model) => (
                        <div
                          key={model.id}
                          className={`model-option ${selectedModel === model.name ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedModel(model.name);
                            setIsModelDropdownOpen(false);
                          }}
                        >
                          <div className="model-option-name">{model.name}</div>
                          <div className="model-option-description">{model.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="voice-mode-btn"
                  onClick={onOpenVoiceMode}
                  title={t("voiceModeTitle")}
                >
                  <FiMic size={16} />
                </button>
                <button
                  type="submit"
                  className="send-button"
                  disabled={!inputValue.trim() && attachedFiles.length === 0}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect("image")}
            />
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls,.pptx,.ppt"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect("document")}
            />
          </form>
        </div>
        {(!currentChat || currentChat.messages.length === 0) && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <span className="suggestion-icon">{suggestion.icon}</span>
                <span className="suggestion-text">{suggestion.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="chat-info-text">{t("disclaimer")}</div>

    </div>
  );
};

export default ChatInterface;
