import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import ImageGeneration from "./components/ImageGeneration";
import { FiSearch, FiX, FiPlus, FiMessageSquare, FiZap } from "react-icons/fi";
import { useTranslation } from "./translations";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

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
  "brainrot",
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

// Function to generate random meow responses in different languages
const generateRandomMeowResponse = (language = "en") => {
  // Language-specific meow variations
  const meowVariationsByLanguage = {
    en: ["meow", "mrow", "mew", "mrrow", "meow", "miau", "nyaa"],
    ru: ["мяу", "мурр", "мяв", "мррр", "мяу", "мур", "мяяв"],
    uk: ["мяу", "мурр", "мяв", "мррр", "мяу", "мур", "мяяв"],
    sk: ["mňau", "mrou", "miau", "mrr", "mňau", "mru", "mňauu"],
    pl: ["miau", "mruuu", "miau", "mrr", "miau", "mru", "miauu"],
    sim: ["meow", "purr", "mrow", "nya", "meow", "mur", "meww"], // Simlish style
    meow: ["MEOW", "MEOOOW", "MEW", "MROW", "MEOW", "MIAU", "NYAA"],
    twink: ["meow~", "mrow💜", "mew✨", "mrrow~", "meow💖", "miau✨", "nyaa~"],
    brainrot: [
      "sigma meow",
      "ohio mrow",
      "skibidi mew",
      "rizz mrrow",
      "gyatt meow",
      "cap miau",
      "bet nyaa",
    ],
  };

  // Language-specific emojis and styles
  const emojisByLanguage = {
    en: {
      cats: [
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
        "�",
        "�🐈‍⬛",
      ],
      hearts: [
        "💕",
        "💖",
        "💗",
        "💝",
        "💘",
        "💙",
        "💚",
        "�",
        "🧡",
        "💜",
        "🤍",
        "🖤",
      ],
      sparkles: ["✨", "⭐", "🌟", "�", "⚡", "🔥"],
    },
    ru: {
      cats: ["�", "🐈", "🐾", "😸", "�😺", "😻", "😼", "😽", "🐈‍⬛"],
      hearts: ["�", "💖", "💗", "❤️", "💝", "💘"],
      sparkles: ["✨", "⭐", "🌟", "�"],
    },
    uk: {
      cats: ["🐱", "🐈", "🐾", "�", "😺", "😻", "😼", "�😽", "🐈‍⬛"],
      hearts: ["�", "💖", "💗", "💙", "💛", "💝"],
      sparkles: ["✨", "⭐", "🌟", "�"],
    },
    sk: {
      cats: ["🐱", "🐈", "🐾", "😸", "�", "😻", "😼", "😽", "🐈‍⬛"],
      hearts: ["💕", "💖", "💗", "💝", "💘"],
      sparkles: ["✨", "⭐", "🌟", "💫"],
    },
    pl: {
      cats: ["🐱", "🐈", "🐾", "😸", "😺", "😻", "😼", "😽", "🐈‍⬛"],
      hearts: ["💕", "💖", "💗", "💝", "💘"],
      sparkles: ["✨", "⭐", "🌟", "💫"],
    },
    sim: {
      cats: ["🐱", "🐈", "🐾", "😸", "😺", "😻", "😼", "😽", "�‍⬛"],
      hearts: ["�", "�💖", "💗", "💝", "💘"],
      sparkles: ["✨", "⭐", "🌟", "�", "🎮", "🎯"],
    },
    meow: {
      cats: [
        "�",
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
      ],
      hearts: [
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
      ],
      sparkles: ["✨", "⭐", "🌟", "💫", "⚡", "�"],
    },
    twink: {
      cats: ["�", "🐈", "🐾", "😸", "�", "😻", "😼", "😽", "🐈‍⬛"],
      hearts: ["💜", "💖", "💕", "💗", "💝", "💘", "🤍", "💙"],
      sparkles: ["✨", "⭐", "🌟", "�", "🦄", "🌈", "💎"],
    },
    brainrot: {
      cats: ["🐱", "🐈", "🐾", "😸", "😺", "😻", "😼", "😽", "🐈‍⬛"],
      hearts: ["💕", "💖", "💗", "💝", "💘"],
      sparkles: ["✨", "⭐", "🌟", "💫", "💀", "🔥", "💯"],
    },
  };

  // Get language-specific variations, fallback to English
  const meowVariations =
    meowVariationsByLanguage[language] || meowVariationsByLanguage.en;
  const emojis = emojisByLanguage[language] || emojisByLanguage.en;

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

  // Capitalize the first letter (except for special languages)
  if (language !== "twink" && language !== "brainrot") {
    response = response.charAt(0).toUpperCase() + response.slice(1);
  }

  // 60% chance to add random emoji
  if (Math.random() < 0.6) {
    const allEmojis = [...emojis.cats, ...emojis.hearts, ...emojis.sparkles];
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
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageGallery, setImageGallery] = useState([]); // Gallery for all generated images

  // View mode state
  const [currentView, setCurrentView] = useState("chat"); // "chat" or "imageGeneration"

  // Year Predictor modal state
  const [isYearPredictorOpen, setIsYearPredictorOpen] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [yearPrediction, setYearPrediction] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState("");
  const [predictionError, setPredictionError] = useState("");

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

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

  // Effect to handle keyboard shortcuts for search and image generation modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen) {
        handleCloseSearch();
      }
      if (e.key === "Escape" && currentView === "imageGeneration") {
        handleCloseImageGeneration();
      }
      if (e.key === "Escape" && isYearPredictorOpen) {
        handleCloseYearPredictor();
      }
    };

    if (
      isSearchOpen ||
      currentView === "imageGeneration" ||
      isYearPredictorOpen
    ) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, currentView, isYearPredictorOpen]);

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

  // Define handleNewChat before it's used in the next useEffect
  const handleNewChat = useCallback(() => {
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
    setCurrentView("chat"); // Switch back to chat view
  }, [chats]);

  // Handle PWA shortcut actions from URL parameters
  useEffect(() => {
    if (isInitialized) {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get("action");

      if (action === "new-chat") {
        handleNewChat();
        // Clean up the URL
        window.history.replaceState({}, "", "/");
      } else if (action === "year-predictor") {
        setIsYearPredictorOpen(true);
        // Clean up the URL
        window.history.replaceState({}, "", "/");
      }
    }
  }, [isInitialized, handleNewChat]);

  // PWA Install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000); // Show after 30 seconds
    };

    const handleAppInstalled = () => {
      // Hide the install prompt
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Handle PWA install
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Dismiss install prompt
  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectChat = (chat) => {
    console.log("📱 Selecting chat:", chat);
    setCurrentChat(chat);
    setCurrentView("chat"); // Switch back to chat view
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

  // Year Predictor modal functions
  const handleOpenYearPredictor = () => {
    setIsYearPredictorOpen(true);
    setYearInput("");
    setYearPrediction("");
  };

  const handleCloseYearPredictor = () => {
    setIsYearPredictorOpen(false);
    setYearInput("");
    setYearPrediction("");
    setIsPredicting(false);
    setPredictionMessage("");
    setPredictionError("");
  };

  const handleYearInputChange = (e) => {
    const value = e.target.value;
    // Only allow 4 digits
    if (value === "" || /^\d{1,4}$/.test(value)) {
      setYearInput(value);
    }
  };
  const handlePredict = async () => {
    if (!yearInput || yearInput.length !== 4) return;

    // Check if the current year (2025) is entered
    const currentYear = new Date().getFullYear();
    const inputYear = parseInt(yearInput);

    if (inputYear !== currentYear) {
      setPredictionError(t("errorMessage"));
      return;
    }

    setIsPredicting(true);
    setYearPrediction("");
    setPredictionError("");

    // Array of funny prediction messages
    const messages = [
      t("loadingMessage1"),
      t("loadingMessage2"),
      t("loadingMessage3"),
    ];

    let messageIndex = 0;
    setPredictionMessage(messages[messageIndex]);

    // Cycle through messages every 2 seconds
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setPredictionMessage(messages[messageIndex]);
    }, 2000);

    // Complete prediction after 6 seconds (3 messages × 2 seconds each)
    setTimeout(() => {
      clearInterval(messageInterval);
      const predictedYear = inputYear + 1;
      setYearPrediction(predictedYear.toString());
      setIsPredicting(false);
      setPredictionMessage("");
    }, 6000);
  };

  // Image generation view functions
  const handleOpenImageGeneration = () => {
    setCurrentView("imageGeneration");
    setImagePrompt("");
    setGeneratedImages([]);
    setIsGeneratingImages(false);

    // Close sidebar on mobile when switching to image generation
    const isMobile = window.innerWidth <= 768;
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleCloseImageGeneration = () => {
    setCurrentView("chat");
    setImagePrompt("");
    setGeneratedImages([]);
    setIsGeneratingImages(false);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImages(true);

    try {
      // Fetch cat image from The Cat API
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search",
        {
          method: "GET",
          headers: {
            "x-api-key": "ylX4blBYT9FaoVd6OhvR",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cat image");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const newImage = {
          id: Date.now(),
          url: data[0].url,
          prompt: imagePrompt,
          timestamp: Date.now(),
        };

        // Add to current generated images (for display)
        setGeneratedImages([newImage]);

        // Add to gallery (for persistent storage)
        setImageGallery((prevGallery) => [newImage, ...prevGallery]);

        // Clear the prompt after successful generation
        setImagePrompt("");
      } else {
        throw new Error("No cat image received from API");
      }
    } catch (error) {
      console.error("Error generating cat image:", error);

      // Fallback to placeholder if API fails
      const fallbackImage = {
        id: Date.now(),
        url: `https://picsum.photos/512/512?random=${Math.random()}`,
        prompt: imagePrompt,
        timestamp: Date.now(),
      };

      // Add to current generated images (for display)
      setGeneratedImages([fallbackImage]);

      // Add to gallery (for persistent storage)
      setImageGallery((prevGallery) => [fallbackImage, ...prevGallery]);

      // Clear the prompt after generation
      setImagePrompt("");
    } finally {
      setIsGeneratingImages(false);
    }
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

      // Generate AI response content first to calculate typing duration
      const aiResponseContent = generateRandomMeowResponse(language);
      const typingDuration = calculateTypingDuration(aiResponseContent);

      // Show typing indicator
      setIsAiTyping(true);

      // Add AI response after calculated delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: aiResponseContent,
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
        setIsAiTyping(false);
      }, typingDuration);
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

    // Generate AI response content first to calculate typing duration
    const aiResponseContent = generateRandomMeowResponse(language);
    const typingDuration = calculateTypingDuration(aiResponseContent);

    // Show typing indicator
    setIsAiTyping(true);

    // Add AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: aiResponseContent,
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
      setIsAiTyping(false);
    }, typingDuration);
  };

  // Calculate typing duration based on message content
  const calculateTypingDuration = (message) => {
    if (!message) return 1000; // Default 1 second

    // Count words in the message
    const words = message
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordCount = words.length;

    // Base duration: 200ms per word, with minimum 800ms and maximum 4000ms
    const baseTime = 200;
    const minTime = 800;
    const maxTime = 4000;

    const calculatedTime = Math.max(
      minTime,
      Math.min(maxTime, wordCount * baseTime)
    );

    console.log(
      `💬 Message: "${message.substring(
        0,
        50
      )}..." | Words: ${wordCount} | Typing duration: ${calculatedTime}ms`
    );

    return calculatedTime;
  };

  // Regenerate AI response for a specific message
  const handleRegenerateResponse = (messageId) => {
    if (!currentChat) return;

    console.log("🔄 Regenerating response for message:", messageId);

    // Find the message to regenerate
    const messageIndex = currentChat.messages.findIndex(
      (msg) => msg.id === messageId
    );
    if (
      messageIndex === -1 ||
      currentChat.messages[messageIndex].sender !== "ai"
    ) {
      console.log("❌ Message not found or not an AI message");
      return;
    }

    // Generate new AI response content
    const newAiResponseContent = generateRandomMeowResponse(language);
    const typingDuration = calculateTypingDuration(newAiResponseContent);

    // Immediately replace the message with typing indicator
    const updatedMessagesWithTyping = [...currentChat.messages];
    updatedMessagesWithTyping[messageIndex] = {
      ...updatedMessagesWithTyping[messageIndex],
      content: "typing",
      isTyping: true,
      timestamp: Date.now(),
    };

    const chatWithTyping = {
      ...currentChat,
      messages: updatedMessagesWithTyping,
    };

    setCurrentChat(chatWithTyping);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChat.id ? chatWithTyping : chat
      )
    );

    // Replace with actual content after calculated delay
    setTimeout(() => {
      const updatedMessages = [...currentChat.messages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        content: newAiResponseContent,
        isTyping: false,
        timestamp: Date.now(), // Update timestamp to show it's regenerated
      };

      const updatedChat = {
        ...currentChat,
        messages: updatedMessages,
      };

      console.log("🔄 Regenerated AI response:", newAiResponseContent);

      setCurrentChat(updatedChat);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChat.id ? updatedChat : chat
        )
      );
    }, typingDuration);
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
          console.log(`Sample ${i + 1}:`, generateRandomMeowResponse(language));
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
        onOpenImageGeneration={handleOpenImageGeneration}
        onOpenYearPredictor={handleOpenYearPredictor}
      />
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      />
      {/* Main Content Area */}
      {currentView === "chat" ? (
        <ChatInterface
          currentChat={currentChat}
          onSendMessage={handleSendMessage}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          language={language}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
          isAiTyping={isAiTyping}
          onRegenerateResponse={handleRegenerateResponse}
        />
      ) : (
        <ImageGeneration
          language={language}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
          generatedImages={generatedImages}
          isGeneratingImages={isGeneratingImages}
          onGenerateImage={handleGenerateImage}
          imageGallery={imageGallery}
          setImageGallery={setImageGallery}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      )}

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

      {/* Year Predictor Modal */}
      {isYearPredictorOpen && (
        <div
          className="year-predictor-modal-overlay"
          onClick={handleCloseYearPredictor}
        >
          <div
            className="year-predictor-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="year-predictor-modal-header">
              <h2>{t("nextYearPredictor")}</h2>
              <button
                className="year-predictor-modal-close"
                onClick={handleCloseYearPredictor}
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="year-predictor-modal-content">
              <div className="year-input-section">
                <label htmlFor="year-input">{t("enterYear")}</label>
                <input
                  id="year-input"
                  type="text"
                  value={yearInput}
                  onChange={handleYearInputChange}
                  placeholder={t("yearPlaceholder")}
                  maxLength="4"
                  className="year-input"
                />
                <button
                  className="predict-btn"
                  onClick={handlePredict}
                  disabled={yearInput.length !== 4 || isPredicting}
                >
                  {isPredicting ? t("predicting") : t("predict")}
                </button>
              </div>

              {predictionError && (
                <div className="prediction-error">
                  <p>{predictionError}</p>
                </div>
              )}

              {(yearPrediction || isPredicting) && (
                <div className="prediction-output">
                  <h3>{t("prediction")}</h3>
                  <div className="prediction-text">
                    {isPredicting ? (
                      <div className="prediction-loading">
                        <div className="loading-spinner">
                          <FiZap className="spinner" size={20} />
                        </div>
                        <span>{predictionMessage}</span>
                      </div>
                    ) : (
                      <p>{yearPrediction}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="install-prompt-overlay">
          <div className="install-prompt">
            <p>Install this app for a better experience!</p>
            <div className="install-prompt-actions">
              <button
                className="install-prompt-button"
                onClick={handleInstallPWA}
              >
                Install
              </button>
              <button
                className="install-prompt-dismiss"
                onClick={dismissInstallPrompt}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
