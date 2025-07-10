import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const hasLoadedFromStorage = useRef(false);

  // Load saved data from localStorage
  useEffect(() => {
    console.log("Loading from localStorage...");

    // Debug: Show all localStorage items
    console.log("All localStorage items:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }

    const savedChats = localStorage.getItem("chatgpt-clone-chats");
    const savedCurrentChat = localStorage.getItem("chatgpt-clone-current-chat");
    const savedTheme = localStorage.getItem("chatgpt-clone-theme");
    const savedLanguage = localStorage.getItem("chatgpt-clone-language");

    console.log("Saved chats raw:", savedChats);
    console.log("Saved current chat raw:", savedCurrentChat);
    console.log("Saved theme:", savedTheme);
    console.log("Saved language:", savedLanguage);

    // Load theme and language immediately
    if (savedTheme) {
      setTheme(savedTheme);
      console.log("Theme loaded:", savedTheme);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
      console.log("Language loaded:", savedLanguage);
    }

    if (savedChats && savedChats !== "undefined" && savedChats !== "null") {
      try {
        const parsedChats = JSON.parse(savedChats);
        if (Array.isArray(parsedChats)) {
          setChats(parsedChats);
          console.log("Chats loaded:", parsedChats);
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        localStorage.removeItem("chatgpt-clone-chats");
      }
    }

    if (
      savedCurrentChat &&
      savedCurrentChat !== "undefined" &&
      savedCurrentChat !== "null"
    ) {
      try {
        const parsedCurrentChat = JSON.parse(savedCurrentChat);
        setCurrentChat(parsedCurrentChat);
        console.log("Current chat loaded:", parsedCurrentChat);
      } catch (error) {
        console.error("Error parsing saved current chat:", error);
        localStorage.removeItem("chatgpt-clone-current-chat");
      }
    }

    hasLoadedFromStorage.current = true;
    console.log("hasLoadedFromStorage set to true");
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (themeToApply) => {
      if (themeToApply === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
      } else {
        document.documentElement.setAttribute("data-theme", themeToApply);
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light"
        );
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    // Only save if we've loaded from storage first (prevent saving initial empty state)
    if (hasLoadedFromStorage.current) {
      try {
        localStorage.setItem("chatgpt-clone-chats", JSON.stringify(chats));
        console.log("Chats saved:", chats);
      } catch (error) {
        console.error("Error saving chats to localStorage:", error);
      }
    }
  }, [chats]);

  useEffect(() => {
    // Only save if we've loaded from storage first
    if (hasLoadedFromStorage.current) {
      try {
        if (currentChat) {
          localStorage.setItem(
            "chatgpt-clone-current-chat",
            JSON.stringify(currentChat)
          );
          console.log("Current chat saved:", currentChat);
        } else {
          localStorage.removeItem("chatgpt-clone-current-chat");
          console.log("Current chat cleared");
        }
      } catch (error) {
        console.error("Error saving current chat to localStorage:", error);
      }
    }
  }, [currentChat]);

  useEffect(() => {
    // Save theme changes, but only after initial load or if it's not the default
    if (hasLoadedFromStorage.current || theme !== "light") {
      try {
        localStorage.setItem("chatgpt-clone-theme", theme);
        console.log("Theme saved:", theme);
      } catch (error) {
        console.error("Error saving theme to localStorage:", error);
      }
    }
  }, [theme]);

  useEffect(() => {
    // Save language changes, but only after initial load or if it's not the default
    if (hasLoadedFromStorage.current || language !== "en") {
      try {
        localStorage.setItem("chatgpt-clone-language", language);
        console.log("Language saved:", language);
      } catch (error) {
        console.error("Error saving language to localStorage:", error);
      }
    }
  }, [language]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleReturnHome = () => {
    setCurrentChat(null);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const handleSendMessage = (message) => {
    if (!currentChat) {
      // Create new chat first
      const newChat = {
        id: Date.now(),
        title: message.content.slice(0, 30) + "...",
        messages: [message],
        createdAt: new Date(),
      };

      setChats([newChat, ...chats]);
      setCurrentChat(newChat);

      // Add AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          content: "Meow! 🐱",
          sender: "ai",
          timestamp: new Date(),
        };

        const finalChat = {
          ...newChat,
          messages: [...newChat.messages, aiResponse],
        };

        setCurrentChat(finalChat);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === newChat.id ? finalChat : chat))
        );
      }, 1000);
      return;
    }

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, message],
      title:
        currentChat.title === "New Chat"
          ? message.content.slice(0, 30) + "..."
          : currentChat.title,
    };

    setCurrentChat(updatedChat);
    setChats(
      chats.map((chat) => (chat.id === currentChat.id ? updatedChat : chat))
    );

    // Add AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: "Meow! 🐱",
        sender: "ai",
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse],
      };

      setCurrentChat(finalChat);
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === currentChat.id ? finalChat : chat))
      );
    }, 1000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

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
    </div>
  );
}

export default App;
