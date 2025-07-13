# MeowGPT 🐱

A delightful chat interface with feline intelligence! MeowGPT is a React-based web application that provides a ChatGPT-like experience with a cute cat theme and multi-language support.

## 💡 Inspiration

MeowGPT was inspired by the viral sensation **[CatGPT](https://github.com/woutervdijke/CatGPT)** - a brilliant parody that took the internet by storm in early 2023. What started as a humorous take on AI assistants quickly became a cultural phenomenon, garnering coverage from major tech publications and capturing the hearts of cat lovers worldwide.

Building upon this purrfect foundation, MeowGPT expands the concept into a fully-featured chat application with enhanced functionality, multi-language support, and a polished user experience that brings the whimsical world of feline AI to life. 🐾

### 🌟 Original CatGPT - _As seen on:_

**[The Verge](https://www.theverge.com/2023/2/1/23580953/forget-about-chatgpt-meow-theres-catgpt) | [NPR](https://www.npr.org/transcripts/1153728071) | [franceinfo](https://www.francetvinfo.fr/live/message/63d/8d9/e6a/37a/44f/9f5/2b1/3ed.html) | [Futurism](https://futurism.com/the-byte/catgpt-ai-answers-cat) | [Hacker News](https://news.ycombinator.com/item?id=34610292)**

**Try the original CatGPT at [catgpt.wvd.io](https://catgpt.wvd.io)**

<img src="https://user-images.githubusercontent.com/15675775/215778138-072b609a-e282-46a4-b345-3f524a85765f.jpg" width="500" height="auto" />

**Original repo:** https://github.com/woutervdijke/CatGPT

## ✨ Features

### 🎯 Core Functionality

- **Interactive Chat Interface**: Real-time conversation with AI responses
- **Multiple Chat Management**: Create, manage, and switch between different chat sessions
- **Persistent Storage**: All chats and settings are saved locally using localStorage
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 🌍 Internationalization

- **7 Language Support**: English, Russian, Ukrainian, Slovak, Polish, Simlish, and Meow
- **Auto Language Detection**: Automatically detects browser language and defaults to supported language
- **Dynamic Language Switching**: Change language on-the-fly without losing context
- **Complete Localization**: All UI elements and messages are translated

### 🎨 Themes & Customization

- **Multiple Theme Options**: Light, Dark, and System themes
- **Automatic Theme Detection**: System theme follows your OS preference (default)
- **Persistent Theme Settings**: Your theme choice is remembered across sessions

### 🤖 AI Models

- **MeowGPT**: Perfect for most tasks 🐱
- **MeowGPT Turbo**: Fast as a cheetah 🐆
- **MeowGPT Mini**: Kitten-sized efficiency 🐾

### 📱 Progressive Web App (PWA) Features

MeowGPT is a fully compliant Progressive Web App with the following features:

### ✨ Core PWA Features

- **🔗 Installable**: Add to home screen on mobile devices and desktop
- **📱 App-like Experience**: Standalone display mode without browser UI
- **⚡ Offline Support**: Service worker caches resources for offline usage
- **🎨 Native Look**: Custom theme colors and icons for platform integration
- **🚀 Fast Loading**: Optimized caching strategy for instant startup

### 🎯 PWA Shortcuts

Long-press the app icon on your home screen to access these quick actions:

- **New Chat**: Start a fresh conversation instantly
- **Year Predictor**: Jump directly to the year prediction feature

### 📦 Installation

#### Desktop (Chrome, Edge, Safari)

1. Visit the app in your browser
2. Look for the install prompt (or click the install icon in the address bar)
3. Click "Install" to add MeowGPT to your applications

#### Mobile (iOS Safari)

1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Customize the name if desired and tap "Add"

#### Mobile (Android Chrome)

1. Open the app in Chrome
2. Tap the three-dot menu
3. Select "Add to Home Screen" or "Install App"
4. Follow the prompts to install

### 🔧 PWA Testing & Development

#### Local Testing

```bash
# Build the production version
npm run build

# Serve locally (PWA features require production build)
npx serve -s build -l 3001

# Run PWA compliance tests
./test-pwa.sh
```

#### PWA Compliance Checklist

- ✅ Web App Manifest with required fields
- ✅ Service Worker for offline support
- ✅ Icons in multiple sizes (16px to 512px)
- ✅ Apple Touch Icons for iOS
- ✅ Maskable icons for adaptive icon support
- ✅ Theme color and viewport meta tags
- ✅ HTTPS requirement (for production deployment)
- ✅ Responsive design for all screen sizes

#### Production Deployment

For full PWA functionality, deploy to an HTTPS-enabled server:

- **GitHub Pages**: `npm run deploy`
- **Netlify**: Connect your repository for auto-deployment
- **Vercel**: Import your GitHub repository
- **Firebase Hosting**: Use Firebase CLI

### 🛠 PWA Assets

#### Icons

- **Sizes**: 16x16, 32x32, 48x48, 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Formats**: PNG for maximum compatibility
- **Special**: Maskable icon for Android adaptive icons
- **Apple**: Dedicated Apple Touch Icon (180x180)

#### Service Worker Features

- **Caching Strategy**: Cache-first for static assets, network-first for API calls
- **Offline Fallback**: Serves cached content when network is unavailable
- **Background Sync**: Prepared for future offline message queuing
- **Push Notifications**: Framework ready for future implementation

#### Manifest Features

- **Display Mode**: Standalone (full-screen app experience)
- **Orientation**: Portrait-primary optimized
- **Theme Integration**: Matches system theme preferences
- **Shortcuts**: Quick actions for power users
- **Screenshots**: Enhanced installation experience

### 🎨 Customization

#### Theme Colors

- **Primary**: `#10a37f` (MeowGPT Green)
- **Background**: `#181818` (Dark theme)
- **Surface**: `#2a2a2a` (Chat bubbles)

#### Icon Customization

To update app icons:

1. Replace the source SVG in `generate-png-icons.sh`
2. Run `./generate-png-icons.sh` to regenerate all sizes
3. Rebuild the app: `npm run build`

### 🔍 PWA Debugging

#### Chrome DevTools

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" for manifest validation
4. Check "Service Workers" for SW status
5. Use "Lighthouse" for PWA audit

#### Common Issues

- **Install prompt not showing**: Check HTTPS, manifest validity, and SW registration
- **Icons not displaying**: Verify icon paths and file existence
- **Offline not working**: Check service worker registration and caching strategy
- **iOS issues**: Ensure Apple-specific meta tags are present

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

## 🌐 Deployment

### GitHub Pages

This project is configured for easy deployment to GitHub Pages:

#### Automatic Deployment

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy your site
3. Your app will be available at `https://yourusername.github.io/MeowGPT`

#### Manual Deployment

1. Install dependencies:

   ```bash
   npm install
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

#### Setup Instructions

1. **Update homepage URL**: In `package.json`, update the `homepage` field:

   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

2. **Enable GitHub Pages**:

   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch as the source

3. **Configure GitHub Actions** (optional):
   - The included workflow (`.github/workflows/deploy.yml`) will automatically deploy on push to main/master
   - No additional configuration needed

### Other Deployment Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `build` folder to S3 bucket
- **Firebase Hosting**: Use Firebase CLI to deploy

## 🎮 Usage

### Starting a New Chat

1. Click the "New Chat" button in the sidebar
2. Type your message in the input field
3. Press Enter or click the send button
4. Enjoy the meow-some responses! 🐾

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
- `testLanguageDetection()`: Test browser language detection

### Available Scripts

- `npm start`: Run development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

### 📱 Testing PWA Features

**Service Worker Testing:**

1. Build the app: `npm run build`
2. Serve the build: `npx serve -s build`
3. Open in browser and check DevTools → Application → Service Workers

**PWA Install Prompt:**

- Install prompt appears after 30 seconds of usage
- Can be triggered manually in DevTools → Application → Manifest → "Add to homescreen"

**Offline Testing:**

1. Install the PWA
2. In DevTools → Network tab, check "Offline"
3. Refresh - basic functionality should still work

**Icon Testing:**

- Icons are auto-generated SVG files in `/public/icons/`
- Use `./generate-icons.sh` to regenerate icons if needed

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

**Made with ❤️ and lots of meows!** 🐾

_MeowGPT - Where AI meets feline wisdom!_
