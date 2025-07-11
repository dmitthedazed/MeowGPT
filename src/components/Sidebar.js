import React, { useState } from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiZap,
  FiSearch,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { useTranslation } from "../translations";

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
}) => {
  const { t } = useTranslation(language);
  const [hoveredChatId, setHoveredChatId] = useState(null);

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
            >
              <div className="logo-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16c-2.5 0-4.5-2-4.5-4.5S9.5 7 12 7s4.5 2 4.5 4.5S14.5 16 12 16z" />
                  <path d="M9 9h.01" />
                  <path d="M15 9h.01" />
                  <path d="M10.5 13.5s1 1 1.5 1 1.5-1 1.5-1" />
                  <path d="M4 6l2 2" />
                  <path d="M20 6l-2 2" />
                  <path d="M12 2v2" />
                </svg>
              </div>
            </button>
          </div>
          {isOpen && (
            <button className="sidebar-close-btn" onClick={onToggle}>
              <FiX size={18} />
            </button>
          )}
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <FiPlus size={16} />
          <span>{t("newChat")}</span>
        </button>
        <button className="search-chat-btn">
          <FiSearch size={16} />
          <span>{t("searchChats")}</span>
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
        <button className="upgrade-plan-btn">
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
