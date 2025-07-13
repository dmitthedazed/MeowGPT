#!/bin/bash

# Create placeholder app icons for PWA
# This script creates simple colored squares as placeholder icons

# Colors
BG_COLOR="#10a37f"
TEXT_COLOR="white"

# Icon sizes
SIZES=(72 96 128 144 152 192 384 512)

# Create icons directory if it doesn't exist
mkdir -p public/icons

# Function to create SVG icon
create_svg_icon() {
    local size=$1
    local output_file="public/icons/icon-${size}x${size}.svg"
    
    cat > "$output_file" << EOF
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG_COLOR}" rx="$(($size / 8))"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="$(($size / 4))" fill="${TEXT_COLOR}" text-anchor="middle" dominant-baseline="central">🐱</text>
</svg>
EOF
    echo "Created SVG icon: $output_file"
}

# Function to create HTML canvas-based PNG (for demonstration)
create_html_icon() {
    local size=$1
    local output_file="public/icons/icon-${size}x${size}.html"
    
    cat > "$output_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
</head>
<body>
    <canvas id="canvas" width="${size}" height="${size}"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '${BG_COLOR}';
        ctx.fillRect(0, 0, ${size}, ${size});
        
        // Border radius (rounded corners)
        ctx.beginPath();
        ctx.roundRect(0, 0, ${size}, ${size}, $(($size / 8)));
        ctx.fillStyle = '${BG_COLOR}';
        ctx.fill();
        
        // Cat emoji
        ctx.font = '$(($size / 3))px Arial';
        ctx.fillStyle = '${TEXT_COLOR}';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐱', ${size}/2, ${size}/2);
        
        // Download the image
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = 'icon-${size}x${size}.png';
            link.href = canvas.toDataURL();
            link.click();
        }, 100);
    </script>
</body>
</html>
EOF
    echo "Created HTML icon generator: $output_file"
}

echo "Creating PWA icons..."

# Create SVG icons for all sizes
for size in "${SIZES[@]}"; do
    create_svg_icon $size
done

echo "PWA icons created successfully!"
echo "Note: SVG icons created. For PNG icons, you can:"
echo "1. Use an online SVG to PNG converter"
echo "2. Use ImageMagick: convert icon.svg icon.png"
echo "3. Use the HTML canvas generators created"
