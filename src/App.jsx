import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import { M3eTheme } from "@m3e/react/theme";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import ImageGeneration from "./components/ImageGeneration";
import VoiceMode from "./components/VoiceMode";
import PaywallModal from "./components/PaywallModal";
import { FiSearch, FiX, FiPlus, FiMessageSquare, FiZap } from "react-icons/fi";
import { useTranslation } from "./translations";
import {
  applyCalculatorInput,
  calculateExpression,
  formatCalculationResult,
} from "./utils/calculator";

// LocalStorage keys
const STORAGE_KEYS = {
  CHATS: "meowgpt-chats",
  CURRENT_CHAT: "meowgpt-current-chat",
  THEME: "meowgpt-theme",
  LANGUAGE: "meowgpt-language",
  PREMIUM: "meowgpt-is-premium",
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

const CALCULATOR_BUTTONS = [
  [
    { label: "C", value: "clear", variant: "muted" },
    { label: "⌫", value: "backspace", variant: "muted" },
    { label: "(", value: "(", variant: "muted" },
    { label: ")", value: ")", variant: "muted" },
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "÷", value: "/", variant: "operator" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "×", value: "*", variant: "operator" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "−", value: "-", variant: "operator" },
  ],
  [
    { label: "0", value: "0" },
    { label: ".", value: "." },
    { label: "=", value: "equals", variant: "equals" },
    { label: "+", value: "+", variant: "operator" },
  ],
];

const CALCULATOR_PAYWALL_TIERS = [
  { id: "basic", nameKey: "calculatorTierBasic", priceKey: "calculatorTierBasicPrice" },
  { id: "plus", nameKey: "calculatorTierPlus", priceKey: "calculatorTierPlusPrice" },
  { id: "pro", nameKey: "calculatorTierPro", priceKey: "calculatorTierProPrice" },
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
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Custom Settings States
  const [fontSize, setFontSize] = useState("cozy");
  const [bubbleStyle, setBubbleStyle] = useState("modern");
  const [voiceActor, setVoiceActor] = useState("meow-classic");

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
  const [viewTransitionKey, setViewTransitionKey] = useState(0); // bumped on view change to trigger CSS entrance animation

  // Temporary chat mode — messages not saved to history
  const [isTemporaryMode, setIsTemporaryMode] = useState(false);
  const [temporaryChat, setTemporaryChat] = useState(null);

  // Chat interaction states
  const [deletingChatId, setDeletingChatId] = useState(null); // id of chat being animated out
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);

  // Message queue — holds pending messages while AI is responding
  const messageQueueRef = useRef([]);
  const isAiTypingRef = useRef(false);

  // Year Predictor modal state
  const [isYearPredictorOpen, setIsYearPredictorOpen] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [yearPrediction, setYearPrediction] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState("");
  const [predictionError, setPredictionError] = useState("");
  const [isHeightCounterOpen, setIsHeightCounterOpen] = useState(false);
  const [heightInput, setHeightInput] = useState("");
  const [heightResult, setHeightResult] = useState("");
  const [heightError, setHeightError] = useState("");
  const [isHeightThinking, setIsHeightThinking] = useState(false);
  const [heightThinkingMessage, setHeightThinkingMessage] = useState("");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorExpression, setCalculatorExpression] = useState("");
  const [calculatorResult, setCalculatorResult] = useState("");
  const [calculatorError, setCalculatorError] = useState("");
  const [calculatorPendingResult, setCalculatorPendingResult] = useState("");
  const [isCalculatorThinking, setIsCalculatorThinking] = useState(false);
  const [isCalculatorPaywallOpen, setIsCalculatorPaywallOpen] = useState(false);
  const [isCalculatorConfettiVisible, setIsCalculatorConfettiVisible] = useState(false);
  const [calculatorConfettiPieces, setCalculatorConfettiPieces] = useState([]);
  const calculatorThinkingTimerRef = useRef(null);
  const calculatorConfettiTimerRef = useRef(null);
  const heightThinkingTimerRef = useRef(null);

  const { t } = useTranslation(language);

  // Spam protection and Toast states
  const messageTimestampsRef = useRef([]);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const currentChatRef = useRef(null);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  const showToast = useCallback((message, type = "info") => {
    setToast((prev) => {
      if (prev && prev.message === message) return prev;
      return { message, type };
    });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
      const savedPremium = StorageUtils.load(STORAGE_KEYS.PREMIUM, false);
      const savedFontSize = StorageUtils.load("meowgpt-font-size", "cozy");
      const savedBubbleStyle = StorageUtils.load("meowgpt-bubble-style", "modern");
      const savedVoiceActor = StorageUtils.load("meowgpt-voice-actor", "meow-classic");

      setTheme(savedTheme);
      setLanguage(savedLanguage);
      setIsPremium(savedPremium);
      setFontSize(savedFontSize);
      setBubbleStyle(savedBubbleStyle);
      setVoiceActor(savedVoiceActor);

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

      // Update theme-color meta tags to match current theme
      const getThemeColor = (theme) => {
        return theme === "dark" ? "#181818" : "#ffffff";
      };

      const themeColor = getThemeColor(actualTheme);

      // Update all theme-color meta tags
      const themeColorMetas = document.querySelectorAll(
        'meta[name="theme-color"]'
      );
      themeColorMetas.forEach((meta) => {
        meta.setAttribute("content", themeColor);
      });

      // Update manifest theme colors dynamically if needed
      // This ensures the PWA chrome/status bar matches the current theme
      document
        .querySelector("html")
        .style.setProperty("--theme-bg-color", themeColor);

      console.log(
        `🎨 Theme applied: ${actualTheme} (from ${themeToApply}) - Status bar color: ${themeColor}`
      );
    };

    applyTheme(theme);

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);

        // Update theme color for system changes too
        const themeColor = newTheme === "dark" ? "#181818" : "#ffffff";
        const themeColorMetas = document.querySelectorAll(
          'meta[name="theme-color"]'
        );
        themeColorMetas.forEach((meta) => {
          meta.setAttribute("content", themeColor);
        });
        document
          .querySelector("html")
          .style.setProperty("--theme-bg-color", themeColor);

        console.log(
          `🎨 System theme changed to: ${newTheme} - Status bar color: ${themeColor}`
        );
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  // Apply preferences
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    StorageUtils.save("meowgpt-font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute("data-bubble-style", bubbleStyle);
    StorageUtils.save("meowgpt-bubble-style", bubbleStyle);
  }, [bubbleStyle]);

  useEffect(() => {
    StorageUtils.save("meowgpt-voice-actor", voiceActor);
  }, [voiceActor]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape — close open panels/views
      if (e.key === "Escape") {
        if (isSearchOpen) { handleCloseSearch(); return; }
        if (currentView === "imageGeneration") { handleCloseImageGeneration(); return; }
        if (isCalculatorOpen) { handleCloseCalculator(); return; }
        if (isYearPredictorOpen) { handleCloseYearPredictor(); return; }
        if (isHeightCounterOpen) { handleCloseHeightCounter(); return; }
      }

      // Ignore shortcuts when user is typing in an input/textarea
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const mod = e.ctrlKey || e.metaKey;
      // Ctrl/Cmd + K  — open search
      if (mod && e.key === "k") {
        e.preventDefault();
        if (!isSearchOpen) handleOpenSearch();
        return;
      }
      // Ctrl/Cmd + N  — new chat
      if (mod && e.key === "n") {
        e.preventDefault();
        handleNewChat();
        return;
      }
      // Ctrl/Cmd + B  — toggle sidebar
      if (mod && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }
      // Ctrl/Cmd + I  — image generation
      if (mod && e.key === "i") {
        e.preventDefault();
        if (currentView !== "imageGeneration") handleOpenImageGeneration();
        else handleCloseImageGeneration();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isSearchOpen,
    currentView,
    isCalculatorOpen,
    isYearPredictorOpen,
    isHeightCounterOpen,
    isSidebarOpen,
  ]);

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

  useEffect(() => {
    return () => {
      if (calculatorThinkingTimerRef.current) {
        clearTimeout(calculatorThinkingTimerRef.current);
      }
      if (calculatorConfettiTimerRef.current) {
        clearTimeout(calculatorConfettiTimerRef.current);
      }
      if (heightThinkingTimerRef.current) {
        clearTimeout(heightThinkingTimerRef.current);
      }
    };
  }, []);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleTemporaryMode = () => {
    setIsTemporaryMode((prev) => {
      if (prev) {
        // Turning off — clear temporary chat
        setTemporaryChat(null);
      } else {
        // Turning on — clear current chat selection
        setCurrentChat(null);
        setTemporaryChat(null);
      }
      return !prev;
    });
  };

  const handleSelectChat = (chat) => {
    console.log("📱 Selecting chat:", chat);
    setCurrentChat(chat);
    setCurrentView("chat");
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
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

  const handleOpenHeightCounter = () => {
    setIsHeightCounterOpen(true);
    setHeightInput("");
    setHeightResult("");
    setHeightError("");
    setIsHeightThinking(false);
    setHeightThinkingMessage("");
  };

  const handleCloseHeightCounter = () => {
    if (heightThinkingTimerRef.current) {
      clearTimeout(heightThinkingTimerRef.current);
      heightThinkingTimerRef.current = null;
    }

    setIsHeightCounterOpen(false);
    setHeightInput("");
    setHeightResult("");
    setHeightError("");
    setIsHeightThinking(false);
    setHeightThinkingMessage("");
  };

  const handleHeightInputChange = (e) => {
    setHeightInput(e.target.value);
  };

  const handleHeightCounter = () => {
    const trimmedInput = heightInput.trim();
    if (!trimmedInput) {
      setHeightError(t("heightCounterError"));
      setHeightResult("");
      setIsHeightThinking(false);
      setHeightThinkingMessage("");
      return;
    }

    const normalizedInput = trimmedInput.replace(",", ".");
    const heightMatch = normalizedInput.match(/-?\d+(?:\.\d+)?/);
    const heightValue = heightMatch ? Number(heightMatch[0]) : Number.NaN;

    if (!Number.isFinite(heightValue) || heightValue <= 0) {
      setHeightError(t("heightCounterError"));
      setHeightResult("");
      setIsHeightThinking(false);
      setHeightThinkingMessage("");
      return;
    }

    const thinkingMessage =
      heightValue < 150
        ? t("heightCounterLowMessage")
        : heightValue > 200
          ? t("heightCounterHighMessage")
          : t("heightCounterThinking");

    setHeightError("");
    setHeightResult("");
    setIsHeightThinking(true);
    setHeightThinkingMessage(thinkingMessage);

    if (heightThinkingTimerRef.current) {
      clearTimeout(heightThinkingTimerRef.current);
    }

    heightThinkingTimerRef.current = setTimeout(() => {
      setHeightResult(trimmedInput);
      setIsHeightThinking(false);
      setHeightThinkingMessage("");
      heightThinkingTimerRef.current = null;
    }, 1800);
  };

  const handleOpenCalculator = () => {
    setIsCalculatorOpen(true);
    setCalculatorExpression("");
    setCalculatorResult("");
    setCalculatorError("");
  };

  const handleCloseCalculator = () => {
    if (calculatorThinkingTimerRef.current) {
      clearTimeout(calculatorThinkingTimerRef.current);
      calculatorThinkingTimerRef.current = null;
    }
    if (calculatorConfettiTimerRef.current) {
      clearTimeout(calculatorConfettiTimerRef.current);
      calculatorConfettiTimerRef.current = null;
    }

    setIsCalculatorOpen(false);
    setCalculatorExpression("");
    setCalculatorResult("");
    setCalculatorError("");
    setCalculatorPendingResult("");
    setIsCalculatorThinking(false);
    setIsCalculatorPaywallOpen(false);
    setIsCalculatorConfettiVisible(false);
    setCalculatorConfettiPieces([]);
  };

  const handleCalculatorSubmit = (e) => {
    e.preventDefault();
    handleCalculatorEquals();
  };

  const handleCalculatorEquals = () => {
    if (!calculatorExpression.trim()) return;

    try {
      const result = calculateExpression(calculatorExpression);
      const formattedResult = formatCalculationResult(result);
      setCalculatorResult("");
      setCalculatorPendingResult(formattedResult);
      setCalculatorError("");
      setIsCalculatorThinking(true);
      setIsCalculatorPaywallOpen(false);

      if (calculatorThinkingTimerRef.current) {
        clearTimeout(calculatorThinkingTimerRef.current);
      }

      calculatorThinkingTimerRef.current = setTimeout(() => {
        setIsCalculatorThinking(false);
        setIsCalculatorPaywallOpen(true);
        calculatorThinkingTimerRef.current = null;
      }, 1800);
    } catch (error) {
      setCalculatorResult("");
      setCalculatorPendingResult("");
      setCalculatorError(t("calculatorError"));
      setIsCalculatorThinking(false);
      setIsCalculatorPaywallOpen(false);
    }
  };

  const handleCalculatorButtonPress = (input) => {
    if (input === "equals") {
      handleCalculatorEquals();
      return;
    }

    setCalculatorExpression((previousExpression) => {
      const startsNewExpression =
        calculatorResult && (/^\d$/.test(input) || input === "." || input === "(");
      const baseExpression = startsNewExpression ? "" : previousExpression;
      return applyCalculatorInput(baseExpression, input);
    });

    setCalculatorResult("");
    setCalculatorPendingResult("");
    setCalculatorError("");
    setIsCalculatorThinking(false);
    setIsCalculatorPaywallOpen(false);

    if (calculatorThinkingTimerRef.current) {
      clearTimeout(calculatorThinkingTimerRef.current);
      calculatorThinkingTimerRef.current = null;
    }
  };

  const createCalculatorConfettiPieces = (count = 90) => {
    const colors = [
      "#ff6b6b",
      "#ffd93d",
      "#6bcBef",
      "#6bcb77",
      "#c77dff",
      "#ff9f1c",
      "#4cc9f0",
      "#f72585",
    ];

    return Array.from({ length: count }, (_, index) => {
      const size = 14 + Math.random() * 14;
      return {
        id: `calculator-confetti-${Date.now()}-${index}`,
        left: Math.random() * 100,
        size,
        delay: Math.random() * 0.25,
        duration: 1.6 + Math.random() * 1.2,
        rotation: Math.random() * 720 - 360,
        drift: (Math.random() * 2 - 1) * 180,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  };

  const triggerCalculatorConfetti = () => {
    setCalculatorConfettiPieces(createCalculatorConfettiPieces());
    setIsCalculatorConfettiVisible(true);

    if (calculatorConfettiTimerRef.current) {
      clearTimeout(calculatorConfettiTimerRef.current);
    }

    calculatorConfettiTimerRef.current = setTimeout(() => {
      setIsCalculatorConfettiVisible(false);
      setCalculatorConfettiPieces([]);
      calculatorConfettiTimerRef.current = null;
    }, 2400);
  };

  const handleCalculatorTierSelect = () => {
    setCalculatorResult(calculatorPendingResult);
    setCalculatorPendingResult("");
    setIsCalculatorPaywallOpen(false);
    triggerCalculatorConfetti();
  };

  // Image generation view functions
  const handleOpenImageGeneration = () => {
    setCurrentView("imageGeneration");
    setViewTransitionKey((k) => k + 1);
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
    setViewTransitionKey((k) => k + 1);
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

  const handleSendMessage = (message, { onAiResponse } = {}) => {
    const now = Date.now();

    // Sliding window rate limiter
    messageTimestampsRef.current = messageTimestampsRef.current.filter(
      (t) => now - t < 5000
    );

    if (messageTimestampsRef.current.length >= 5) {
      showToast(t("tooManyMessages"), "error");
      return;
    }

    // Strictly reject submissions if AI is already active responding
    if (isAiTypingRef.current) {
      showToast(t("tooManyMessages"), "error");
      return;
    }

    messageTimestampsRef.current.push(now);

    const messageWithTimestamp = {
      ...message,
      timestamp: Date.now(),
    };

    // --- Temporary chat mode: never touch `chats` ---
    if (isTemporaryMode) {
      const baseChat = temporaryChat ?? {
        id: "temp",
        title: "Temporary Chat",
        messages: [],
        createdAt: Date.now(),
        temporary: true,
      };
      const updatedTemp = {
        ...baseChat,
        messages: [...baseChat.messages, messageWithTimestamp],
      };
      setTemporaryChat(updatedTemp);

      const aiResponseContent = generateRandomMeowResponse(language);
      const typingDuration = calculateTypingDuration(aiResponseContent);
      isAiTypingRef.current = true;
      setIsAiTyping(true);

      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: aiResponseContent,
          sender: "ai",
          timestamp: Date.now(),
        };
        setTemporaryChat((prev) => ({
          ...prev,
          messages: [...prev.messages, aiResponse],
        }));
        isAiTypingRef.current = false;
        setIsAiTyping(false);
        onAiResponse?.(aiResponseContent);
      }, typingDuration);
      return;
    }

    const activeChat = currentChatRef.current;
    if (!activeChat) {
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
      currentChatRef.current = newChat; // Sync ref synchronously!
      setChats((prevChats) => [newChat, ...prevChats]);
      setCurrentChat(newChat);

      // Generate AI response content first to calculate typing duration
      const aiResponseContent = generateRandomMeowResponse(language);
      const typingDuration = calculateTypingDuration(aiResponseContent);

      // Show typing indicator
      isAiTypingRef.current = true;
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

        currentChatRef.current = finalChat;
        setCurrentChat(finalChat);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === newChat.id ? finalChat : chat))
        );
        isAiTypingRef.current = false;
        setIsAiTyping(false);
        onAiResponse?.(aiResponseContent);
      }, typingDuration);
      return;
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, messageWithTimestamp],
      title:
        activeChat.title === "New Chat"
          ? message.content.length > 30
            ? message.content.slice(0, 30) + "..."
            : message.content
          : activeChat.title,
    };

    currentChatRef.current = updatedChat; // Sync ref synchronously!
    setCurrentChat(updatedChat);
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))
    );

    // Generate AI response content first to calculate typing duration
    const aiResponseContent = generateRandomMeowResponse(language);
    const typingDuration = calculateTypingDuration(aiResponseContent);

    // Show typing indicator
    isAiTypingRef.current = true;
    setIsAiTyping(true);

    // Add AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: aiResponseContent,
        sender: "ai",
        timestamp: Date.now(),
      };

      setCurrentChat((prevCurrent) => {
        if (!prevCurrent) return null;
        const finalChat = {
          ...prevCurrent,
          messages: [...prevCurrent.messages, aiResponse],
        };
        currentChatRef.current = finalChat; // Sync ref synchronously!
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === prevCurrent.id ? finalChat : chat))
        );
        return finalChat;
      });

      isAiTypingRef.current = false;
      setIsAiTyping(false);
      onAiResponse?.(aiResponseContent);
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

  // Regenerate AI response for a specific message, supporting version arrays
  const handleRegenerateResponse = (messageId) => {
    const activeChat = isTemporaryMode ? temporaryChat : currentChatRef.current;
    if (!activeChat) return;
    if (isAiTypingRef.current) return;

    console.log("🔄 Regenerating response for messageId:", messageId);

    const messageIndex = activeChat.messages.findIndex(
      (msg) => msg.id === messageId
    );
    if (
      messageIndex === -1 ||
      activeChat.messages[messageIndex].sender !== "ai"
    ) {
      return;
    }

    const targetMsg = activeChat.messages[messageIndex];
    const newAiResponseContent = generateRandomMeowResponse(language);
    const typingDuration = calculateTypingDuration(newAiResponseContent);

    isAiTypingRef.current = true;
    setIsAiTyping(true);

    // Set message to typing loading
    const updatedMessagesWithTyping = [...activeChat.messages];
    updatedMessagesWithTyping[messageIndex] = {
      ...targetMsg,
      isTyping: true,
      timestamp: Date.now(),
    };

    if (isTemporaryMode) {
      setTemporaryChat({
        ...activeChat,
        messages: updatedMessagesWithTyping,
      });
    } else {
      const chatWithTyping = {
        ...activeChat,
        messages: updatedMessagesWithTyping,
      };
      currentChatRef.current = chatWithTyping;
      setCurrentChat(chatWithTyping);
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === activeChat.id ? chatWithTyping : chat))
      );
    }

    setTimeout(() => {
      const latestChat = isTemporaryMode ? temporaryChat : (currentChatRef.current || currentChat);
      if (!latestChat) return;

      const latestMsg = latestChat.messages[messageIndex];
      const originalContent = targetMsg.versions 
        ? targetMsg.versions[targetMsg.activeVersionIndex ?? 0] 
        : targetMsg.content;
      const versions = targetMsg.versions || [originalContent];
      const newVersions = [...versions, newAiResponseContent];
      const newActiveIndex = newVersions.length - 1;

      const updatedMessages = [...latestChat.messages];
      updatedMessages[messageIndex] = {
        ...latestMsg,
        content: newAiResponseContent,
        versions: newVersions,
        activeVersionIndex: newActiveIndex,
        isTyping: false,
        timestamp: Date.now(),
      };

      if (isTemporaryMode) {
        setTemporaryChat({
          ...latestChat,
          messages: updatedMessages,
        });
      } else {
        const updatedChat = {
          ...latestChat,
          messages: updatedMessages,
        };
        currentChatRef.current = updatedChat;
        setCurrentChat(updatedChat);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === latestChat.id ? updatedChat : chat))
        );
      }

      isAiTypingRef.current = false;
      setIsAiTyping(false);
    }, typingDuration);
  };

  // Switch between message response versions
  const handleSwitchMessageVersion = (messageId, newIndex) => {
    const activeChat = isTemporaryMode ? temporaryChat : currentChatRef.current;
    if (!activeChat) return;

    const updatedMessages = activeChat.messages.map((msg) => {
      if (msg.id === messageId && msg.versions) {
        const idx = Math.max(0, Math.min(msg.versions.length - 1, newIndex));
        return {
          ...msg,
          activeVersionIndex: idx,
          content: msg.versions[idx],
        };
      }
      return msg;
    });

    if (isTemporaryMode) {
      setTemporaryChat({
        ...activeChat,
        messages: updatedMessages,
      });
    } else {
      const updatedChat = {
        ...activeChat,
        messages: updatedMessages,
      };
      currentChatRef.current = updatedChat;
      setCurrentChat(updatedChat);
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))
      );
    }
  };

  const handleDeleteChatAnimated = (chatId) => {
    setDeletingChatId(chatId);
    setTimeout(() => {
      setDeletingChatId(null);
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      setChats((prevChats) => prevChats.filter((c) => c.id !== chatId));
    }, 320);
  };

  const handleRenameChat = (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    const trimmed = newTitle.trim();
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === chatId ? { ...c, title: trimmed } : c))
    );
    if (currentChat?.id === chatId) {
      setCurrentChat((prev) => ({ ...prev, title: trimmed }));
    }
  };

  const handleThemeChange = (newTheme) => {
    console.log("🎨 Theme changing to:", newTheme);
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    console.log("🌐 Language changing to:", newLanguage);
    setLanguage(newLanguage);
  };

  const handleCancelSubscription = () => {
    const localizedConfirmMsg = 
      language === "ru" ? "Вы уверены, что хотите отменить подписку Meow Plus и потерять все привилегии? 😿" :
      language === "uk" ? "Ви впевнені, що хочете скасувати підписку Meow Plus та втратити всі привілеї? 😿" :
      "Are you sure you want to cancel your Meow Plus subscription and lose all active perks? 😿";

    if (window.confirm(localizedConfirmMsg)) {
      setIsPremium(false);
      StorageUtils.save(STORAGE_KEYS.PREMIUM, false);
      
      const localizedToastMsg = 
        language === "ru" ? "Подписка Meow Plus успешно отменена. 😿" :
        language === "uk" ? "Підписку Meow Plus успішно скасовано. 😿" :
        "Meow Plus subscription successfully cancelled. 😿";

      setToast({
        message: localizedToastMsg,
        type: "info",
      });

      setTimeout(() => setToast(null), 4000);
      return true;
    }
    return false;
  };

  const handleUpgradeSuccess = () => {
    console.log("👑 User successfully upgraded to MeowGPT Plus!");
    setIsPremium(true);
    StorageUtils.save(STORAGE_KEYS.PREMIUM, true);
    
    const localizedToastMsg = 
      language === "ru" ? "Добро пожаловать в Meow Plus! 👑🐱✨" :
      language === "uk" ? "Ласкаво просимо до Meow Plus! 👑🐱✨" :
      "Welcome to Meow Plus! 👑🐱✨";

    setToast({
      message: localizedToastMsg,
      type: "success",
    });

    // Auto dismiss toast after 5 seconds
    setTimeout(() => {
      setToast(null);
    }, 5000);
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
    if (import.meta.env.MODE === "development") {
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
    if (import.meta.env.MODE === "development") {
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
        {t("loading")}
      </div>
    );
  }

  const m3eScheme = theme === "system" ? "auto" : theme;

  return (
    <M3eTheme color="#FF7043" scheme={m3eScheme}>
    <div className={`app ${theme}`} data-theme={theme}>
      {/* AI typing progress bar */}
      <div className={`ai-progress-bar ${isAiTyping ? "active" : ""}`} />
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        currentChat={currentChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onReturnHome={handleReturnHome}
        onDeleteChat={handleDeleteChatAnimated}
        onRenameChat={handleRenameChat}
        language={language}
        onOpenSearch={handleOpenSearch}
        onOpenImageGeneration={handleOpenImageGeneration}
        onOpenYearPredictor={handleOpenYearPredictor}
        onOpenHeightCounter={handleOpenHeightCounter}
        onOpenCalculator={handleOpenCalculator}
        currentView={currentView}
        deletingChatId={deletingChatId}
        theme={theme}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        isPremium={isPremium}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        bubbleStyle={bubbleStyle}
        onBubbleStyleChange={setBubbleStyle}
        voiceActor={voiceActor}
        onVoiceActorChange={setVoiceActor}
        onCancelSubscription={handleCancelSubscription}
        onClearAllData={clearAllData}
      />
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      />
      {/* Main Content Area */}
      <div key={viewTransitionKey} className="view-content">
        {currentView === "chat" ? (
          <ChatInterface
            currentChat={isTemporaryMode ? temporaryChat : currentChat}
            onSendMessage={handleSendMessage}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            theme={theme}
            language={language}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            isAiTyping={isAiTyping}
            onRegenerateResponse={handleRegenerateResponse}
            onSwitchMessageVersion={handleSwitchMessageVersion}
            onOpenSearch={handleOpenSearch}
            onNewChat={handleNewChat}
            isTemporaryMode={isTemporaryMode}
            onToggleTemporaryMode={handleToggleTemporaryMode}
            onOpenVoiceMode={() => setIsVoiceModeOpen(true)}
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
      </div>

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
            <div className="search-modal-divider" />
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
                  <span>{t("noChatsFound")}</span>
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

      {/* Height Counter Modal */}
      {isHeightCounterOpen && (
        <div
          className="height-counter-modal-overlay"
          onClick={handleCloseHeightCounter}
        >
          <div
            className="height-counter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="height-counter-modal-header">
              <h2>{t("heightCounter")}</h2>
              <button
                className="height-counter-modal-close"
                onClick={handleCloseHeightCounter}
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="height-counter-modal-content">
              <div className="height-input-section">
                <label htmlFor="height-input">{t("heightCounterQuestion")}</label>
                <input
                  id="height-input"
                  type="text"
                  value={heightInput}
                  onChange={handleHeightInputChange}
                  placeholder={t("heightCounterPlaceholder")}
                  className="height-input"
                />
                <button
                  className="height-btn"
                  onClick={handleHeightCounter}
                  disabled={!heightInput.trim() || isHeightThinking}
                >
                  {isHeightThinking
                    ? t("heightCounterChecking")
                    : t("heightCounterCheck")}
                </button>
              </div>

              {heightError && (
                <div className="height-error">
                  <p>{heightError}</p>
                </div>
              )}

              {(heightResult || isHeightThinking) && (
                <div className="height-output">
                  <h3>{t("heightCounterResult")}</h3>
                  <div className="height-text">
                    {isHeightThinking ? (
                      <div className="prediction-loading">
                        <div className="loading-spinner">
                          <FiZap className="spinner" size={20} />
                        </div>
                        <span>{heightThinkingMessage}</span>
                      </div>
                    ) : (
                      <p>{heightResult}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {isCalculatorOpen && (
        <div
          className="calculator-modal-overlay"
          onClick={handleCloseCalculator}
        >
          <div
            className="calculator-modal-shell"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="calculator-modal">
              <div className="calculator-modal-header">
                <h2>{t("calculator")}</h2>
                <button
                  className="calculator-modal-close"
                  onClick={handleCloseCalculator}
                >
                  <FiX size={18} />
                </button>
              </div>
              <form className="calculator-modal-content" onSubmit={handleCalculatorSubmit}>
                <div className="calculator-screen" aria-live="polite">
                  <div className="calculator-expression">
                    {calculatorExpression || "0"}
                  </div>
                  <div className={`calculator-screen-footer${calculatorError ? " is-error" : ""}`}>
                    {calculatorError ||
                      (isCalculatorThinking ? t("calculatorThinking") : "") ||
                      calculatorResult ||
                      (isCalculatorPaywallOpen ? t("calculatorLocked") : t("calculatorReady"))}
                  </div>
                  {isCalculatorThinking && (
                    <div className="calculator-thinking" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>

                <div className="calculator-keypad">
                  {CALCULATOR_BUTTONS.flat().map((button) => (
                    <button
                      key={`${button.label}-${button.value}`}
                      type="button"
                      className={`calculator-key calculator-key--${button.variant || "number"}${
                        button.wide ? " calculator-key--wide" : ""
                      }`}
                      onClick={() => handleCalculatorButtonPress(button.value)}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {isCalculatorPaywallOpen && (
              <div className="calculator-paywall-overlay">
                <div className="calculator-paywall">
                  <div className="calculator-paywall-header">
                    <h3>{t("calculatorPaywallTitle")}</h3>
                    <p>{t("calculatorPaywallSubtitle")}</p>
                  </div>
                  <div className="calculator-tier-list">
                    {CALCULATOR_PAYWALL_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        className="calculator-tier"
                        onClick={handleCalculatorTierSelect}
                      >
                        <span>{t(tier.nameKey)}</span>
                        <strong>{t(tier.priceKey)}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {isCalculatorConfettiVisible && (
            <div className="calculator-confetti-overlay" aria-hidden="true">
              {calculatorConfettiPieces.map((piece) => (
                <span
                  key={piece.id}
                  className="calculator-confetti-piece"
                  style={{
                    left: `${piece.left}%`,
                    "--confetti-size": `${piece.size}px`,
                    "--confetti-color": piece.color,
                    "--confetti-delay": `${piece.delay}s`,
                    "--confetti-duration": `${piece.duration}s`,
                    "--confetti-rotate": `${piece.rotation}deg`,
                    "--confetti-drift": `${piece.drift}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Mode Overlay */}
      {isVoiceModeOpen && (
        <VoiceMode
          language={language}
          currentChat={isTemporaryMode ? temporaryChat : currentChat}
          isTemporaryMode={isTemporaryMode}
          onSendMessage={handleSendMessage}
          onClose={() => setIsVoiceModeOpen(false)}
        />
      )}

      {/* Fake Paywall Modal Overlay */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        language={language}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-container ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)} title={t("close")}>
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
    </M3eTheme>
  );
}

export default App;
