#!/bin/bash

# Generate PNG icons for PWA from a single SVG source
# This script creates all required icon sizes for PWA compliance

ICON_DIR="public/icons"
TEMP_SVG="temp_icon.svg"

# Create the icons directory if it doesn't exist
mkdir -p "$ICON_DIR"

# Create a high-quality SVG icon for MeowGPT
cat > "$TEMP_SVG" << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="256" cy="256" r="256" fill="#10a37f"/>
  
  <!-- Cat face -->
  <circle cx="256" cy="220" r="140" fill="#ffffff"/>
  
  <!-- Cat ears -->
  <polygon points="160,120 210,60 240,140" fill="#ffffff"/>
  <polygon points="272,140 302,60 352,120" fill="#ffffff"/>
  <polygon points="175,100 200,75 220,120" fill="#ff69b4"/>
  <polygon points="292,120 312,75 337,100" fill="#ff69b4"/>
  
  <!-- Cat eyes -->
  <ellipse cx="220" cy="200" rx="20" ry="25" fill="#000000"/>
  <ellipse cx="292" cy="200" rx="20" ry="25" fill="#000000"/>
  <ellipse cx="225" cy="190" rx="8" ry="10" fill="#ffffff"/>
  <ellipse cx="297" cy="190" rx="8" ry="10" fill="#ffffff"/>
  
  <!-- Cat nose -->
  <polygon points="256,230 245,245 267,245" fill="#ff69b4"/>
  
  <!-- Cat mouth -->
  <path d="M 256 245 Q 235 260 220 250" stroke="#000000" stroke-width="3" fill="none"/>
  <path d="M 256 245 Q 277 260 292 250" stroke="#000000" stroke-width="3" fill="none"/>
  
  <!-- Cat whiskers -->
  <line x1="160" y1="220" x2="190" y2="215" stroke="#000000" stroke-width="2"/>
  <line x1="160" y1="240" x2="190" y2="235" stroke="#000000" stroke-width="2"/>
  <line x1="322" y1="215" x2="352" y2="220" stroke="#000000" stroke-width="2"/>
  <line x1="322" y1="235" x2="352" y2="240" stroke="#000000" stroke-width="2"/>
  
  <!-- Chat bubble -->
  <circle cx="380" cy="380" r="80" fill="#ffffff" stroke="#10a37f" stroke-width="4"/>
  <text x="380" y="395" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#10a37f">AI</text>
  <polygon points="320,420 300,440 340,440" fill="#ffffff" stroke="#10a37f" stroke-width="4"/>
</svg>
EOF

# Array of icon sizes needed for PWA
sizes=(16 32 48 72 96 128 144 152 192 384 512)

# Check if ImageMagick is available
if command -v magick &> /dev/null; then
    echo "Using ImageMagick to generate PNG icons..."
    
    for size in "${sizes[@]}"; do
        echo "Generating ${size}x${size} icon..."
        magick "$TEMP_SVG" -resize "${size}x${size}" "$ICON_DIR/icon-${size}x${size}.png"
    done
    
    # Also create Apple touch icon
    magick "$TEMP_SVG" -resize "180x180" "$ICON_DIR/apple-touch-icon.png"
    
    # Create maskable icon (with padding for safe area)
    magick "$TEMP_SVG" -resize "416x416" -gravity center -extent "512x512" -background "#10a37f" "$ICON_DIR/maskable-icon-512x512.png"
    
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick (convert) to generate PNG icons..."
    
    for size in "${sizes[@]}"; do
        echo "Generating ${size}x${size} icon..."
        convert "$TEMP_SVG" -resize "${size}x${size}" "$ICON_DIR/icon-${size}x${size}.png"
    done
    
    # Also create Apple touch icon
    convert "$TEMP_SVG" -resize "180x180" "$ICON_DIR/apple-touch-icon.png"
    
    # Create maskable icon (with padding for safe area)
    convert "$TEMP_SVG" -resize "416x416" -gravity center -extent "512x512" -background "#10a37f" "$ICON_DIR/maskable-icon-512x512.png"
    
elif command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert to generate PNG icons..."
    
    for size in "${sizes[@]}"; do
        echo "Generating ${size}x${size} icon..."
        rsvg-convert -w "$size" -h "$size" "$TEMP_SVG" > "$ICON_DIR/icon-${size}x${size}.png"
    done
    
    # Also create Apple touch icon
    rsvg-convert -w 180 -h 180 "$TEMP_SVG" > "$ICON_DIR/apple-touch-icon.png"
    
    # Create maskable icon
    rsvg-convert -w 512 -h 512 "$TEMP_SVG" > "$ICON_DIR/maskable-icon-512x512.png"
    
else
    echo "Warning: No image conversion tool found (ImageMagick or rsvg-convert)."
    echo "Install ImageMagick with: brew install imagemagick"
    echo "Or install rsvg with: brew install librsvg"
    echo "Keeping existing SVG icons for now."
    
    # Clean up temp file and exit
    rm -f "$TEMP_SVG"
    exit 1
fi

# Clean up temp file
rm -f "$TEMP_SVG"

echo "✅ PNG icons generated successfully!"
echo "📱 Icons are available in: $ICON_DIR"
echo ""
echo "Generated icons:"
ls -la "$ICON_DIR"/*.png | awk '{print "  - " $9 " (" $5 " bytes)"}'
