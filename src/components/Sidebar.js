import React, { useState } from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiZap,
  FiSearch,
  FiX,
  FiTrash2,
  FiMoreHorizontal,
} from "react-icons/fi";

const Sidebar = ({
  isOpen,
  onToggle,
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onReturnHome,
  onDeleteChat,
}) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (window.confirm("Are you sure you want to delete this chat?")) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
      <div className="sidebar-header">
        <div className="header-top">
          <div className="logo-section">
            <button
              className="logo-btn"
              onClick={isOpen ? onReturnHome : onToggle}
            >
              <div className="logo-icon">
                <FiZap size={16} />
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
          <span>New chat</span>
        </button>
        <button className="search-chat-btn">
          <FiSearch size={16} />
          <span>Search chats</span>
        </button>
      </div>

      <div className="sidebar-content">
        {chats.length === 0 ? (
          <div className="no-chats">No chats yet</div>
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
                  title="Delete chat"
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
            <div className="upgrade-title">Upgrade plan</div>
            <div className="upgrade-subtitle">
              More access to the best models
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
