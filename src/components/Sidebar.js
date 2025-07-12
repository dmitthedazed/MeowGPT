import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiZap,
  FiSearch,
  FiX,
  FiTrash2,
  FiImage,
} from "react-icons/fi";
import { useTranslation } from "../translations";
import { ReactComponent as MeowGPTIcon } from "../icon.svg";
import { ReactComponent as MeowGPTLightIcon } from "../icon-light.svg";

const Sidebar = ({
  isOpen,
  onToggle,
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onReturnHome,
  onDeleteChat,
  language,
  onOpenSearch,
  onOpenImageGeneration,
}) => {
  const { t } = useTranslation(language);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");

  // Function to get the current theme from the document
  const getCurrentTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme || "light";
  };

  // Function to get the appropriate logo icon based on theme
  const getLogoIcon = () => {
    return currentTheme === "dark" ? MeowGPTLightIcon : MeowGPTIcon;
  };

  // Effect to monitor theme changes
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getCurrentTheme());
    };

    // Set initial theme
    updateTheme();

    // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateTheme();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Cleanup observer
    return () => observer.disconnect();
  }, []);

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (window.confirm("Are you sure you want to delete this chat?")) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div
      className={`sidebar ${!isOpen ? "closed" : ""} ${isOpen ? "open" : ""}`}
    >
      <div className="sidebar-header">
        <div className="header-top">
          <div className="logo-section">
            <button
              className="logo-btn"
              onClick={isOpen ? onReturnHome : onToggle}
              title={!isOpen ? "MeowGPT" : ""}
            >
              <div className="logo-icon">
                {React.createElement(getLogoIcon())}
              </div>
            </button>
          </div>
          {isOpen && (
            <button className="sidebar-close-btn" onClick={onToggle}>
              <FiX size={18} />
            </button>
          )}
        </div>
        <button
          className="new-chat-btn"
          onClick={onNewChat}
          title={!isOpen ? t("newChat") : ""}
        >
          <FiPlus size={16} />
          <span>{t("newChat")}</span>
        </button>
        <button
          className="search-chat-btn"
          onClick={onOpenSearch}
          title={!isOpen ? t("searchChats") : ""}
        >
          <FiSearch size={16} />
          <span>{t("searchChats")}</span>
        </button>
        <button
          className="image-generation-btn"
          onClick={onOpenImageGeneration}
          title={!isOpen ? t("imageGeneration") : ""}
        >
          <FiImage size={16} />
          <span>{t("imageGeneration")}</span>
        </button>
      </div>

      <div className="sidebar-content">
        {chats.length === 0 ? (
          <div className="no-chats">{t("noChats")}</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                currentChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => onSelectChat(chat)}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
              title={!isOpen ? chat.title : ""}
            >
              <div className="chat-item-content">
                <FiMessageSquare size={16} className="chat-icon" />
                <div className="chat-details">
                  <span className="chat-title">{chat.title}</span>
                </div>
              </div>
              {isOpen && hoveredChatId === chat.id && (
                <button
                  className="delete-chat-btn"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  title={t("deleteChat")}
                >
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button
          className="upgrade-plan-btn"
          title={!isOpen ? t("upgradeTitle") : ""}
        >
          <FiZap size={20} />
          <div className="upgrade-text">
            <div className="upgrade-title">{t("upgradeTitle")}</div>
            <div className="upgrade-subtitle">{t("upgradeSubtitle")}</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
