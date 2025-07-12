import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import { FiSearch, FiX, FiPlus, FiMessageSquare } from "react-icons/fi";
import { useTranslation } from "./translations";

// LocalStorage keys
const STORAGE_KEYS = {
  CHATS: "meowgpt-chats",
  CURRENT_CHAT: "meowgpt-current-chat",
  THEME: "meowgpt-theme",
  LANGUAGE: "meowgpt-language",
};

// Supported languages
const SUPPORTED_LANGUAGES = [
  "en",
  "ru",
  "uk",
  "sk",
  "pl",
  "sim",
  "meow",
  "twink",
];

// Function to detect user's preferred language
const detectUserLanguage = () => {
  // Get browser language
  const browserLanguage = navigator.language || navigator.userLanguage;

  // Extract language code (e.g., "en-US" -> "en")
  const languageCode = browserLanguage.split("-")[0].toLowerCase();

  console.log(
    `🌐 Browser language: ${browserLanguage}, detected code: ${languageCode}`
  );

  // Check if the language is supported
  if (SUPPORTED_LANGUAGES.includes(languageCode)) {
    console.log(`✅ Language ${languageCode} is supported`);
    return languageCode;
  }

  // Fallback to English if not supported
  console.log(
    `❌ Language ${languageCode} not supported, falling back to English`
  );
  return "en";
};

// Storage utility functions
const StorageUtils = {
  save: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      console.log(`✅ Saved ${key}:`, value);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error);
      return false;
    }
  },

  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === "undefined" || item === "null") {
        console.log(
          `📦 No data found for ${key}, using default:`,
          defaultValue
        );
        return defaultValue;
      }
      const parsed = JSON.parse(item);
      console.log(`📦 Loaded ${key}:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`❌ Error loading ${key}:`, error);
      localStorage.removeItem(key);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed ${key}`);
    } catch (error) {
      console.error(`❌ Error removing ${key}:`, error);
    }
  },
};

// Function to generate random meow responses
const generateRandomMeowResponse = () => {
  const meowVariations = [
    "meow",
    "mrow",
    "mew",
    "mrrow",
    "meow",
    "miau",
    "nyaa",
  ];
  const catEmojis = [
    "🐱",
    "🐈",
    "🐾",
    "😸",
    "😺",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "🐈‍⬛",
  ];
  const heartEmojis = [
    "💕",
    "💖",
    "💗",
    "💝",
    "💘",
    "💙",
    "💚",
    "💛",
    "🧡",
    "💜",
    "🤍",
    "🖤",
  ];
  const sparkleEmojis = ["✨", "⭐", "🌟", "💫", "⚡", "🔥"];

  // Random number of meows (1-35)
  const meowCount = Math.floor(Math.random() * 35) + 1;

  let response = "";

  // Generate meows
  for (let i = 0; i < meowCount; i++) {
    const randomMeow =
      meowVariations[Math.floor(Math.random() * meowVariations.length)];
    response += randomMeow;

    // Add space between meows (except for the last one)
    if (i < meowCount - 1) {
      response += " ";
    }
  }

  // Capitalize the first letter
  response = response.charAt(0).toUpperCase() + response.slice(1);

  // 60% chance to add random emoji
  if (Math.random() < 0.6) {
    const allEmojis = [...catEmojis, ...heartEmojis, ...sparkleEmojis];
    const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    response += " " + randomEmoji;

    // 20% chance to add a second emoji
    if (Math.random() < 0.2) {
      const secondEmoji =
        allEmojis[Math.floor(Math.random() * allEmojis.length)];
      response += " " + secondEmoji;
    }
  }

  return response;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > 768 // Open by default on desktop, closed on mobile
  );
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState(detectUserLanguage());
  const [isInitialized, setIsInitialized] = useState(false);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { t } = useTranslation(language);

  // Initialize app data from localStorage
  useEffect(() => {
    const initializeApp = () => {
      console.log("🚀 Initializing app...");

      // Load settings first - default to "system" theme to follow OS preference
      const savedTheme = StorageUtils.load(STORAGE_KEYS.THEME, "system");
      const savedLanguage = StorageUtils.load(
        STORAGE_KEYS.LANGUAGE,
        detectUserLanguage()
      );

      setTheme(savedTheme);
      setLanguage(savedLanguage);

      // Load chats
      const savedChats = StorageUtils.load(STORAGE_KEYS.CHATS, []);
      const savedCurrentChat = StorageUtils.load(
        STORAGE_KEYS.CURRENT_CHAT,
        null
      );

      // Validate and set chats
      if (Array.isArray(savedChats)) {
        setChats(savedChats);
      } else {
        console.warn("Invalid chats data, resetting...");
        setChats([]);
      }

      // Validate and set current chat
      if (
        savedCurrentChat &&
        typeof savedCurrentChat === "object" &&
        savedCurrentChat.id
      ) {
        setCurrentChat(savedCurrentChat);
      } else {
        setCurrentChat(null);
      }

      setIsInitialized(true);
      console.log("✅ App initialized successfully");
    };

    initializeApp();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (themeToApply) => {
      let actualTheme = themeToApply;

      if (themeToApply === "system") {
        actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }

      document.documentElement.setAttribute("data-theme", actualTheme);
      console.log(`🎨 Theme applied: ${actualTheme} (from ${themeToApply})`);
    };

    applyTheme(theme);

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        console.log(`🎨 System theme changed to: ${newTheme}`);
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  // Effect to handle keyboard shortcuts for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        handleCloseSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  // Save chats to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    StorageUtils.save(STORAGE_KEYS.CHATS, chats);
  }, [chats, isInitialized]);

  // Save current chat to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    if (currentChat) {
      StorageUtils.save(STORAGE_KEYS.CURRENT_CHAT, currentChat);
    } else {
      StorageUtils.remove(STORAGE_KEYS.CURRENT_CHAT);
    }
  }, [currentChat, isInitialized]);

  // Save theme to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    StorageUtils.save(STORAGE_KEYS.THEME, theme);
  }, [theme, isInitialized]);

  // Save language to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    StorageUtils.save(STORAGE_KEYS.LANGUAGE, language);
  }, [language, isInitialized]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    // Check if there's already an empty chat (no messages)
    const existingEmptyChat = chats.find((chat) => chat.messages.length === 0);

    if (existingEmptyChat) {
      // If there's an empty chat, just select it instead of creating a new one
      console.log("📱 Selecting existing empty chat:", existingEmptyChat);
      setCurrentChat(existingEmptyChat);
      return;
    }

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(), // Use timestamp instead of Date object
    };

    console.log("🆕 Creating new chat:", newChat);
    setChats((prevChats) => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const handleSelectChat = (chat) => {
    console.log("📱 Selecting chat:", chat);
    setCurrentChat(chat);
  };

  const handleReturnHome = () => {
    console.log("🏠 Returning to home");
    setCurrentChat(null);
  };

  const handleDeleteChat = (chatId) => {
    console.log("🗑️ Deleting chat:", chatId);

    setChats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
      console.log("Updated chats after deletion:", updatedChats);
      return updatedChats;
    });

    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  // Search modal functions
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
    setSearchResults([]);

    // Close sidebar on mobile when opening search modal
    const isMobile = window.innerWidth <= 768;
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter chats based on title
    const filtered = chats.filter((chat) =>
      chat.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSearchChatSelect = (chat) => {
    handleSelectChat(chat);
    handleCloseSearch();
  };

  const handleSendMessage = (message) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: Date.now(), // Use timestamp instead of Date object
    };

    if (!currentChat) {
      // Create new chat first
      const newChat = {
        id: Date.now(),
        title:
          message.content.length > 30
            ? message.content.slice(0, 30) + "..."
            : message.content,
        messages: [messageWithTimestamp],
        createdAt: Date.now(),
      };

      console.log("💬 Creating new chat with message:", newChat);

      setChats((prevChats) => [newChat, ...prevChats]);
      setCurrentChat(newChat);

      // Add AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: generateRandomMeowResponse(),
          sender: "ai",
          timestamp: Date.now(),
        };

        const finalChat = {
          ...newChat,
          messages: [...newChat.messages, aiResponse],
        };

        console.log("🤖 Adding AI response to new chat:", finalChat);

        setCurrentChat(finalChat);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === newChat.id ? finalChat : chat))
        );
      }, 1000);
      return;
    }

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, messageWithTimestamp],
      title:
        currentChat.title === "New Chat"
          ? message.content.length > 30
            ? message.content.slice(0, 30) + "..."
            : message.content
          : currentChat.title,
    };

    console.log("💬 Adding message to existing chat:", updatedChat);

    setCurrentChat(updatedChat);
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === currentChat.id ? updatedChat : chat))
    );

    // Add AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: generateRandomMeowResponse(),
        sender: "ai",
        timestamp: Date.now(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse],
      };

      console.log("🤖 Adding AI response to existing chat:", finalChat);

      setCurrentChat(finalChat);
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === currentChat.id ? finalChat : chat))
      );
    }, 1000);
  };

  const handleThemeChange = (newTheme) => {
    console.log("🎨 Theme changing to:", newTheme);
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    console.log("🌐 Language changing to:", newLanguage);
    setLanguage(newLanguage);
  };

  // Debug function to clear all localStorage data
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      Object.values(STORAGE_KEYS).forEach((key) => StorageUtils.remove(key));
      setChats([]);
      setCurrentChat(null);
      setTheme("system");
      setLanguage(detectUserLanguage());
      console.log("🧹 All data cleared");
    }
  };

  // Add to window for debugging (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      window.clearChatData = clearAllData;
      window.showStorageData = () => {
        console.log("📊 Current storage data:");
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
          console.log(`${name}:`, StorageUtils.load(key));
        });
      };
      window.testStorage = () => {
        console.log("🧪 Testing localStorage functionality...");

        // Test saving and loading
        StorageUtils.save("test-key", { test: "data", timestamp: Date.now() });
        const loaded = StorageUtils.load("test-key");
        console.log("Test save/load:", loaded);

        // Test current state
        console.log("Current state:", {
          chats: chats.length,
          currentChat: currentChat?.id,
          theme,
          language,
          isInitialized,
        });

        StorageUtils.remove("test-key");
        console.log("✅ Storage test completed");
      };
      window.testLanguageDetection = () => {
        console.log("🧪 Testing language detection...");
        console.log("Browser language:", navigator.language);
        console.log("Detected language:", detectUserLanguage());
        console.log("Supported languages:", SUPPORTED_LANGUAGES);
        console.log("Current language:", language);
        console.log("✅ Language detection test completed");
      };
      window.testRandomMeow = () => {
        console.log("🧪 Testing random meow generation...");
        for (let i = 0; i < 5; i++) {
          console.log(`Sample ${i + 1}:`, generateRandomMeowResponse());
        }
        console.log("✅ Random meow test completed");
      };
    }
  }, [chats, currentChat, theme, language, isInitialized]);

  // Add development helper to show storage status
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Current app state:");
      console.log("- Chats:", chats.length);
      console.log("- Current chat:", currentChat?.id || "none");
      console.log("- Theme:", theme);
      console.log("- Language:", language);
      console.log("- Initialized:", isInitialized);
    }
  }, [chats, currentChat, theme, language, isInitialized]);

  // Don't render until initialized to prevent flash of empty state
  if (!isInitialized) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        currentChat={currentChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onReturnHome={handleReturnHome}
        onDeleteChat={handleDeleteChat}
        language={language}
        onOpenSearch={handleOpenSearch}
      />
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      />
      <ChatInterface
        currentChat={currentChat}
        onSendMessage={handleSendMessage}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        theme={theme}
        language={language}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
      />

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={handleCloseSearch}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <div className="search-input-container">
                <FiSearch size={16} className="search-input-icon" />
                <input
                  type="text"
                  placeholder={t("searchChats")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                  autoFocus
                />
              </div>
              <button
                className="search-modal-close"
                onClick={handleCloseSearch}
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="search-modal-content">
              {searchQuery === "" ? (
                <div className="search-empty-state">
                  <div
                    className="search-suggestion"
                    onClick={() => {
                      handleNewChat();
                      handleCloseSearch();
                    }}
                  >
                    <FiPlus size={16} />
                    <span>{t("newChat")}</span>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="search-no-results">
                  <span>No chats found</span>
                </div>
              ) : (
                <div className="search-results">
                  {searchResults.map((chat) => (
                    <div
                      key={chat.id}
                      className={`search-result-item ${
                        currentChat?.id === chat.id ? "active" : ""
                      }`}
                      onClick={() => handleSearchChatSelect(chat)}
                    >
                      <FiMessageSquare
                        size={16}
                        className="search-result-icon"
                      />
                      <span className="search-result-title">{chat.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
