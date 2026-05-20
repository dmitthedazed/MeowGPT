import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiSearch,
  FiX,
  FiTrash2,
  FiImage,
  FiEdit2,
  FiCheck,
  FiGithub,
  FiZap,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiMoreHorizontal,
  FiCpu,
  FiDivideCircle,
  FiTrendingUp,
  FiSliders,
  FiEye,
  FiVolume2,
  FiAward,
} from "react-icons/fi";
import { useTranslation } from "../translations";
import MeowGPTIcon from "../assets/icon.svg?react";
import MeowGPTLightIcon from "../assets/icon-light.svg?react";

const Sidebar = ({
  isOpen,
  onToggle,
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onReturnHome,
  onDeleteChat,
  onRenameChat,
  language,
  onOpenSearch,
  onOpenImageGeneration,
  onOpenYearPredictor,
  onOpenCalculator,
  onOpenHeightCounter,
  currentView,
  deletingChatId,
  theme,
  onThemeChange,
  onLanguageChange,
  onOpenPaywall,
  isPremium = false,
  fontSize,
  onFontSizeChange,
  bubbleStyle,
  onBubbleStyleChange,
  voiceActor,
  onVoiceActorChange,
  onCancelSubscription,
  onClearAllData,
}) => {
  const { t } = useTranslation(language);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState("general");
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const exploreDropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ bottom: 0, left: 0 });
  const renameInputRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const accountTriggerRef = useRef(null);
  const settingsModalRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (settingsModalRef.current && !settingsModalRef.current.contains(event.target) && event.target.classList.contains("settings-modal-overlay")) {
        setIsSettingsModalOpen(false);
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setIsExploreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
    setIsAccountDropdownOpen(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
  };

  // Focus rename input when renaming starts
  useEffect(() => {
    if (renamingChatId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingChatId]);

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  const handleDoubleClickTitle = (e, chat) => {
    e.stopPropagation();
    if (!isOpen) return; // don't rename in rail mode
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
  };

  const commitRename = () => {
    if (renamingChatId && renameValue.trim()) {
      onRenameChat(renamingChatId, renameValue.trim());
    }
    setRenamingChatId(null);
    setRenameValue("");
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    }
    if (e.key === "Escape") {
      setRenamingChatId(null);
      setRenameValue("");
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
        {/* Explore dropdown */}
        <div className="explore-dropdown-wrapper" ref={exploreDropdownRef}>
          <button
            className={`explore-btn${isExploreDropdownOpen ? " active" : ""}`}
            onClick={() => setIsExploreDropdownOpen((o) => !o)}
            title={!isOpen ? t("explore") : ""}
          >
            <FiMoreHorizontal size={16} />
            <span>{t("explore")}</span>
          </button>
          {isExploreDropdownOpen && isOpen && (
            <div className="explore-dropdown-menu">
              <button
                className={`explore-dropdown-item${currentView === "imageGeneration" ? " active" : ""}`}
                onClick={() => { onOpenImageGeneration(); setIsExploreDropdownOpen(false); }}
              >
                <FiImage size={15} />
                <span>{t("imageGeneration")}</span>
              </button>
              <div className="explore-dropdown-divider" />
              <div className="explore-dropdown-label">{t("gpts")}</div>
              <button
                className="explore-dropdown-item"
                onClick={() => { onOpenYearPredictor(); setIsExploreDropdownOpen(false); }}
              >
                <FiCpu size={15} />
                <span>{t("nextYearPredictor")}</span>
              </button>
              <button
                className="explore-dropdown-item"
                onClick={() => { onOpenHeightCounter(); setIsExploreDropdownOpen(false); }}
              >
                <FiTrendingUp size={15} />
                <span>{t("heightCounter")}</span>
              </button>
              <button
                className="explore-dropdown-item"
                onClick={() => { onOpenCalculator(); setIsExploreDropdownOpen(false); }}
              >
                <FiDivideCircle size={15} />
                <span>{t("calculator")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        {chats.length === 0 ? (
          <div className="no-chats">{t("noChats")}</div>
        ) : (
          chats.map((chat) => {
            const isRenaming = renamingChatId === chat.id;
            const isDeleting = deletingChatId === chat.id;

            return (
              <div
                key={chat.id}
                className={`chat-item${currentChat?.id === chat.id ? " active" : ""}${isDeleting ? " removing" : ""}`}
                onClick={() => !isRenaming && onSelectChat(chat)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                title={!isOpen ? chat.title : ""}
              >
                <div className="chat-item-content">
                  <FiMessageSquare size={16} className="chat-icon" />
                  <div className="chat-details">
                    {isRenaming ? (
                      <input
                        ref={renameInputRef}
                        className="chat-rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={handleRenameKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        maxLength={60}
                      />
                    ) : (
                      <span
                        className="chat-title"
                        onDoubleClick={(e) => handleDoubleClickTitle(e, chat)}
                      >
                        {chat.title}
                      </span>
                    )}
                  </div>
                </div>
                {isOpen && hoveredChatId === chat.id && !isRenaming && (
                  <div className="chat-item-actions">
                    <button
                      className="rename-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoubleClickTitle(e, chat);
                      }}
                      title={t("rename")}
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      title={t("deleteChat")}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                )}
                {isOpen && isRenaming && (
                  <button
                    className="rename-confirm-btn"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commitRename();
                    }}
                    title={t("save")}
                  >
                    <FiCheck size={13} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <div className="account-dropdown" ref={accountDropdownRef}>
          <button
            ref={accountTriggerRef}
            className="account-dropdown-trigger sidebar-account-trigger"
            onClick={() => {
              if (!isAccountDropdownOpen) {
                const rect = accountTriggerRef.current.getBoundingClientRect();
                setDropdownPos({
                  bottom: window.innerHeight - rect.top + 8,
                  left: rect.left,
                });
              }
              setIsAccountDropdownOpen(!isAccountDropdownOpen);
            }}
            title={!isOpen ? t("account") : ""}
          >
            <div className={`account-avatar ${isPremium ? "premium" : ""}`}>
              {isPremium ? "👑" : "A"}
            </div>
            <span className="sidebar-account-label">{t("account")}</span>
          </button>

          {isAccountDropdownOpen && (
            <div
              className="account-dropdown-menu account-dropdown-menu--fixed"
              style={{ bottom: dropdownPos.bottom, left: dropdownPos.left }}
            >
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

              {!isPremium && (
                <div
                  className="account-menu-item"
                  onClick={() => {
                    onOpenPaywall();
                    setIsAccountDropdownOpen(false);
                  }}
                >
                  <FiZap size={16} />
                  <span>{t("upgradePlan")}</span>
                </div>
              )}

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

      {isSettingsModalOpen && (
        <div className="settings-modal-overlay" onClick={handleCloseSettings}>
          <div
            ref={settingsModalRef}
            className="settings-modal settings-modal--tabbed"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-modal-header">
              <h2>{t("settingsTitle")}</h2>
              <button className="settings-close-btn" onClick={handleCloseSettings}>
                <FiX size={20} />
              </button>
            </div>

            <div className="settings-modal-body">
              {/* Left Navigation Tabs */}
              <div className="settings-sidebar">
                <button
                  className={`settings-tab-btn ${settingsActiveTab === "general" ? "active" : ""}`}
                  onClick={() => setSettingsActiveTab("general")}
                >
                  <FiSliders size={16} />
                  <span>{t("general")}</span>
                </button>
                <button
                  className={`settings-tab-btn ${settingsActiveTab === "appearance" ? "active" : ""}`}
                  onClick={() => setSettingsActiveTab("appearance")}
                >
                  <FiEye size={16} />
                  <span>{t("appearance")}</span>
                </button>
                <button
                  className={`settings-tab-btn ${settingsActiveTab === "voice" ? "active" : ""}`}
                  onClick={() => setSettingsActiveTab("voice")}
                >
                  <FiVolume2 size={16} />
                  <span>Voice & Audio</span>
                </button>
                <button
                  className={`settings-tab-btn ${settingsActiveTab === "subscription" ? "active" : ""}`}
                  onClick={() => setSettingsActiveTab("subscription")}
                >
                  <FiAward size={16} />
                  <span>Subscription</span>
                </button>
              </div>

              {/* Right Tab Content */}
              <div className="settings-tab-content">
                {settingsActiveTab === "general" && (
                  <div className="settings-pane animate-fade-in">
                    <div className="settings-pane-header">
                      <h3>{t("general")}</h3>
                    </div>
                    
                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>{t("language")}</label>
                        <span className="settings-item-desc">Change the display language of MeowGPT</span>
                      </div>
                      <select
                        className="settings-select"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                      >
                        {languages.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label style={{ color: "var(--md-error, #ffb4ab)" }}>Wipe All Data</label>
                        <span className="settings-item-desc">Delete all custom chats, generated image cache and preferences</span>
                      </div>
                      <button
                        className="settings-action-btn danger-btn"
                        onClick={() => {
                          if (onClearAllData()) {
                            handleCloseSettings();
                          }
                        }}
                      >
                        <FiTrash2 size={14} />
                        <span>Reset App</span>
                      </button>
                    </div>
                  </div>
                )}

                {settingsActiveTab === "appearance" && (
                  <div className="settings-pane animate-fade-in">
                    <div className="settings-pane-header">
                      <h3>{t("appearance")}</h3>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>{t("theme")}</label>
                        <span className="settings-item-desc">Choose between light, dark, or system setting</span>
                      </div>
                      <select
                        className="settings-select"
                        value={theme}
                        onChange={(e) => onThemeChange(e.target.value)}
                      >
                        {themes.map((themeOption) => (
                          <option key={themeOption.id} value={themeOption.id}>
                            {themeOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>Message Scale</label>
                        <span className="settings-item-desc">Adjust the typography font size of dialogue bubbles</span>
                      </div>
                      <select
                        className="settings-select"
                        value={fontSize}
                        onChange={(e) => onFontSizeChange(e.target.value)}
                      >
                        <option value="compact">Compact (14px)</option>
                        <option value="cozy">Cozy (16px)</option>
                        <option value="large">Large (18px)</option>
                      </select>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>Chat Layout Style</label>
                        <span className="settings-item-desc">Choose between standard cozy bubbles or flat minimalist lines</span>
                      </div>
                      <select
                        className="settings-select"
                        value={bubbleStyle}
                        onChange={(e) => onBubbleStyleChange(e.target.value)}
                      >
                        <option value="modern">Cozy Rounded Bubbles</option>
                        <option value="minimalist">Minimalist Layout</option>
                      </select>
                    </div>
                  </div>
                )}

                {settingsActiveTab === "voice" && (
                  <div className="settings-pane animate-fade-in">
                    <div className="settings-pane-header">
                      <h3>Voice & Audio Preferences</h3>
                    </div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>Active Voice Speaker</label>
                        <span className="settings-item-desc">Choose a different kitten persona for audio responses</span>
                      </div>
                      <select
                        className="settings-select"
                        value={voiceActor}
                        onChange={(e) => onVoiceActorChange(e.target.value)}
                      >
                        <option value="meow-classic">Classic Siamese Vocal (Meow!)</option>
                        <option value="cat-whisperer">Calm British Purr (Mellow)</option>
                        <option value="kitty-turbo">Playful Munchkin (High-Pitch)</option>
                      </select>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="settings-item">
                      <div className="settings-item-label">
                        <label>Speech Auto-readback</label>
                        <span className="settings-item-desc">Automatically read back generated AI responses out loud</span>
                      </div>
                      <div className="settings-toggle-wrapper">
                        <input type="checkbox" defaultChecked={true} className="settings-checkbox" id="autoread-chk" />
                        <label htmlFor="autoread-chk" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                )}

                {settingsActiveTab === "subscription" && (
                  <div className="settings-pane animate-fade-in">
                    <div className="settings-pane-header">
                      <h3>Subscription Management</h3>
                    </div>

                    <div className="settings-sub-status-card">
                      <div className="status-card-header">
                        <span className="current-plan-title">Current Active Plan</span>
                        <span className={`plan-pill ${isPremium ? "plus" : "free"}`}>
                          {isPremium ? "👑 Meow Plus" : "Free"}
                        </span>
                      </div>

                      <div className="status-card-body">
                        {isPremium ? (
                          <>
                            <div className="status-row">
                              <span>Billing Status</span>
                              <span className="status-badge-active">Active</span>
                            </div>
                            <div className="status-row">
                              <span>Renews Next On</span>
                              <span>June 20, 2026</span>
                            </div>
                            <div className="status-row">
                              <span>Payment Card</span>
                              <span>Mastercard ending in 4242</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="status-row">
                              <span>Standard Turn Delay</span>
                              <span>None (Queued message queue)</span>
                            </div>
                            <div className="status-row">
                              <span>Purr Privileges</span>
                              <span>Standard models</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="subscription-controls">
                      {isPremium ? (
                        <div className="settings-item">
                          <div className="settings-item-label">
                            <label>Cancel Subscription</label>
                            <span className="settings-item-desc">Stop auto-renewal and return user status back to Free tier</span>
                          </div>
                          <button
                            className="settings-action-btn danger-btn-outline"
                            onClick={() => {
                              if (onCancelSubscription()) {
                                handleCloseSettings();
                              }
                            }}
                          >
                            Cancel Plan
                          </button>
                        </div>
                      ) : (
                        <div className="settings-item">
                          <div className="settings-item-label">
                            <label>Upgrade to Meow Plus</label>
                            <span className="settings-item-desc">Unlock turbo speeds, premium models and custom features!</span>
                          </div>
                          <button
                            className="settings-action-btn upgrade-plus-action"
                            onClick={() => {
                              handleCloseSettings();
                              setTimeout(() => {
                                onOpenPaywall();
                              }, 150);
                            }}
                          >
                            <FiZap size={14} />
                            <span>Upgrade Now</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
