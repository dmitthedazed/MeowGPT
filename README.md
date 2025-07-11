# MeowGPT 🐱

A delightful chat interface with feline intelligence! MeowGPT is a React-based web application that provides a ChatGPT-like experience with a cute cat theme and multi-language support.

## ✨ Features

### 🎯 Core Functionality

- **Interactive Chat Interface**: Real-time conversation with AI responses
- **Multiple Chat Management**: Create, manage, and switch between different chat sessions
- **Persistent Storage**: All chats and settings are saved locally using localStorage
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 🌍 Internationalization

- **7 Language Support**: English, Russian, Ukrainian, Slovak, Polish, Simlish, and Meow
- **Dynamic Language Switching**: Change language on-the-fly without losing context
- **Complete Localization**: All UI elements and messages are translated

### 🎨 Themes & Customization

- **Multiple Theme Options**: Light, Dark, and System themes
- **Automatic Theme Detection**: System theme follows your OS preference
- **Persistent Theme Settings**: Your theme choice is remembered across sessions

### 🤖 AI Models

- **MeowGPT**: Perfect for most tasks 🐱
- **MeowGPT Turbo**: Fast as a cheetah 🐆
- **MeowGPT Mini**: Kitten-sized efficiency 🐾

### 💬 Chat Features

- **Message Actions**: Copy, rate (thumbs up/down), regenerate, and share messages
- **Typing Indicators**: Visual feedback when AI is responding
- **Auto-scrolling**: Messages automatically scroll to the latest
- **Chat History**: Browse and search through previous conversations
- **Chat Deletion**: Remove unwanted conversations

### 🔧 Advanced Features

- **Settings Modal**: Centralized configuration for themes and languages
- **Temporary Chat Mode**: Option for temporary conversations
- **Message Rating System**: Rate AI responses for quality feedback
- **Keyboard Shortcuts**: Press Enter to send, Shift+Enter for new lines
- **Auto-resize Input**: Text area automatically adjusts to content
- **Welcome Screen**: Friendly introduction for new users

### 📱 User Interface

- **Collapsible Sidebar**: Expandable/collapsible navigation panel
- **Modern Design**: Clean, intuitive ChatGPT-inspired interface
- **Cat-themed Elements**: Adorable cat emojis and feline-inspired design
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Polished transitions and hover effects

### 🛠️ Technical Features

- **LocalStorage Integration**: Robust data persistence with error handling
- **React Hooks**: Modern React functional components with hooks
- **Icon Library**: Comprehensive icon set using React Icons (Feather Icons)
- **CSS Theming**: Dynamic theming system with CSS custom properties
- **Development Tools**: Built-in debugging utilities for development

### 🌟 Special Features

- **Chat Titles**: Automatic title generation from first message
- **Message Timestamps**: Track when messages were sent
- **Error Handling**: Graceful error handling for storage operations
- **Performance Optimized**: Efficient rendering and state management
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/MeowGPT2.git
   cd MeowGPT2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 🎮 Usage

### Starting a New Chat

1. Click the "New Chat" button in the sidebar
2. Type your message in the input field
3. Press Enter or click the send button
4. Enjoy the meow-some responses! 🐾

### Managing Chats

- **Switch Chats**: Click on any chat in the sidebar to open it
- **Delete Chats**: Hover over a chat and click the trash icon
- **Search Chats**: Use the search functionality to find specific conversations

### Customizing Your Experience

1. Click on your avatar in the top-right corner
2. Select "Settings" from the dropdown menu
3. Choose your preferred theme and language
4. Settings are automatically saved

### Language Options

- 🇺🇸 **English**: Standard interface
- 🇷🇺 **Russian**: Русский интерфейс
- 🇺🇦 **Ukrainian**: Українська мова
- 🇸🇰 **Slovak**: Slovenské rozhranie
- 🇵🇱 **Polish**: Polski interfejs
- 🎮 **Simlish**: Plerg meshaloob sul blarfy!
- 🐱 **Meow**: Meow meow meow meow!

## 🏗️ Technical Architecture

### Built With

- **React 18**: Modern React with hooks and functional components
- **React Icons**: Comprehensive icon library
- **CSS3**: Modern styling with custom properties for theming
- **localStorage**: Client-side data persistence

### Project Structure

```
src/
├── components/
│   ├── ChatInterface.js    # Main chat interface component
│   └── Sidebar.js          # Navigation and chat list
├── App.js                  # Main application component
├── App.css                 # Global styles and theming
├── index.js               # Application entry point
└── translations.js        # Internationalization system
```

### Key Components

#### App.js

- Main application state management
- LocalStorage integration
- Theme and language coordination
- Chat management logic

#### ChatInterface.js

- Message rendering and interaction
- Input handling and validation
- Settings modal management
- AI model selection

#### Sidebar.js

- Chat list management
- Navigation controls
- User account interface

#### translations.js

- Complete internationalization system
- 7 language support
- Dynamic translation loading

## 🛡️ Data Persistence

MeowGPT uses localStorage for client-side data persistence:

- **Chats**: All chat history and messages
- **Settings**: Theme and language preferences
- **Current Session**: Active chat state
- **User Preferences**: UI customizations

Data is automatically saved and synchronized across browser sessions.

## 🎨 Theming

The application supports three theme modes:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for low-light environments
- **System Theme**: Automatically matches your operating system preference

## 🐛 Development

### Debug Tools

In development mode, open the browser console and use:

- `clearChatData()`: Clear all stored data
- `showStorageData()`: Display current storage state
- `testStorage()`: Test localStorage functionality

### Available Scripts

- `npm start`: Run development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Languages

1. Add translations to `src/translations.js`
2. Update the language selector in `ChatInterface.js`
3. Test all UI elements with the new language

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Created by**: dimka and GitHub Copilot
- **Inspired by**: ChatGPT's interface design
- **Icons**: Feather Icons via React Icons
- **Special Thanks**: To all the cats who provided moral support during development 🐱

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Try clearing your browser's localStorage
3. Ensure you're using a modern browser with JavaScript enabled

---

**Made with ❤️ and lots of meows!** 🐾

_MeowGPT - Where AI meets feline wisdom!_
