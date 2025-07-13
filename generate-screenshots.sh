#!/bin/bash

# Generate placeholder screenshots for PWA
# In a real scenario, you would take actual screenshots of your app

SCREENSHOT_DIR="public/screenshots"
mkdir -p "$SCREENSHOT_DIR"

# Create placeholder desktop screenshot (1280x720)
cat > temp_desktop.svg << 'EOF'
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1280" height="720" fill="#181818"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="1280" height="80" fill="#10a37f"/>
  <text x="640" y="50" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="white">MeowGPT - AI Chat Assistant</text>
  
  <!-- Chat interface mockup -->
  <rect x="100" y="120" width="1080" height="500" fill="#2a2a2a" rx="10"/>
  
  <!-- Sample chat messages -->
  <rect x="140" y="160" width="400" height="60" fill="#333" rx="15"/>
  <text x="160" y="195" font-family="Arial, sans-serif" font-size="16" fill="white">Hello! How can I help you today?</text>
  
  <rect x="740" y="240" width="400" height="60" fill="#10a37f" rx="15"/>
  <text x="760" y="275" font-family="Arial, sans-serif" font-size="16" fill="white">Meow! 🐱 I'm here to chat!</text>
  
  <rect x="140" y="320" width="350" height="60" fill="#333" rx="15"/>
  <text x="160" y="355" font-family="Arial, sans-serif" font-size="16" fill="white">Can you predict next year?</text>
  
  <rect x="740" y="400" width="400" height="80" fill="#10a37f" rx="15"/>
  <text x="760" y="430" font-family="Arial, sans-serif" font-size="14" fill="white">Meow! I predict 2026 will be</text>
  <text x="760" y="450" font-family="Arial, sans-serif" font-size="14" fill="white">purr-fectly amazing! 🔮</text>
  
  <!-- Input area -->
  <rect x="140" y="540" width="900" height="50" fill="#333" rx="25"/>
  <text x="160" y="570" font-family="Arial, sans-serif" font-size="16" fill="#888">Type your message...</text>
  
  <!-- Sidebar -->
  <rect x="20" y="120" width="60" height="500" fill="#1a1a1a" rx="5"/>
  <text x="50" y="160" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">💬</text>
  <text x="50" y="200" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">🔮</text>
  <text x="50" y="240" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">⚙️</text>
</svg>
EOF

# Create placeholder mobile screenshot (390x844)
cat > temp_mobile.svg << 'EOF'
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="390" height="844" fill="#181818"/>
  
  <!-- Status bar area -->
  <rect x="0" y="0" width="390" height="50" fill="#000"/>
  <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" fill="white">9:41</text>
  <text x="350" y="30" font-family="Arial, sans-serif" font-size="14" text-anchor="end" fill="white">100%</text>
  
  <!-- Header -->
  <rect x="0" y="50" width="390" height="60" fill="#10a37f"/>
  <text x="195" y="85" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="white">MeowGPT</text>
  
  <!-- Chat area -->
  <rect x="20" y="130" width="350" height="600" fill="#2a2a2a" rx="10"/>
  
  <!-- Sample mobile chat messages -->
  <rect x="40" y="160" width="200" height="50" fill="#333" rx="15"/>
  <text x="50" y="185" font-family="Arial, sans-serif" font-size="14" fill="white">Hello MeowGPT!</text>
  
  <rect x="150" y="230" width="200" height="50" fill="#10a37f" rx="15"/>
  <text x="160" y="255" font-family="Arial, sans-serif" font-size="14" fill="white">Meow! Hi there! 🐱</text>
  
  <rect x="40" y="300" width="180" height="50" fill="#333" rx="15"/>
  <text x="50" y="325" font-family="Arial, sans-serif" font-size="14" fill="white">How are you?</text>
  
  <rect x="150" y="370" width="200" height="70" fill="#10a37f" rx="15"/>
  <text x="160" y="395" font-family="Arial, sans-serif" font-size="12" fill="white">Purr-fectly fine!</text>
  <text x="160" y="415" font-family="Arial, sans-serif" font-size="12" fill="white">Ready to chat! 😸</text>
  
  <!-- Input area -->
  <rect x="40" y="650" width="250" height="40" fill="#333" rx="20"/>
  <text x="50" y="675" font-family="Arial, sans-serif" font-size="14" fill="#888">Type message...</text>
  
  <!-- Send button -->
  <circle cx="330" cy="670" r="20" fill="#10a37f"/>
  <text x="330" y="675" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">➤</text>
  
  <!-- Bottom navigation -->
  <rect x="0" y="780" width="390" height="64" fill="#1a1a1a"/>
  <text x="97" y="815" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">💬</text>
  <text x="195" y="815" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">🔮</text>
  <text x="293" y="815" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">⚙️</text>
</svg>
EOF

# Convert to PNG using ImageMagick
if command -v magick &> /dev/null; then
    echo "Generating desktop screenshot (1280x720)..."
    magick temp_desktop.svg "$SCREENSHOT_DIR/desktop.png"
    
    echo "Generating mobile screenshot (390x844)..."
    magick temp_mobile.svg "$SCREENSHOT_DIR/mobile.png"
    
    echo "✅ Screenshots generated successfully!"
    
    # Clean up temp files
    rm temp_desktop.svg temp_mobile.svg
    
    echo "📱 Screenshots are available in: $SCREENSHOT_DIR"
    ls -la "$SCREENSHOT_DIR"/*.png | awk '{print "  - " $9 " (" $5 " bytes)"}'
else
    echo "❌ ImageMagick not found. Please install it to generate screenshots."
    exit 1
fi
