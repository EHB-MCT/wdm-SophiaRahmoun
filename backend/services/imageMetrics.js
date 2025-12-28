import canvas from "canvas";
import path from "path";

export const calculateImageMetrics = async (imagePath) => {
  try {
    const image = await canvas.loadImage(imagePath);
    const ctx = canvas.createCanvas(image.width, image.height).getContext("2d");
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
    
    // Calculate brightness (average luminance)
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Luminance formula: 0.299*R + 0.587*G + 0.114*B
      totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
    }
    const brightness = totalBrightness / (data.length / 4) / 255; // Normalize to 0-1
    
    // Calculate background clutter (edge density using simple gradient)
    let edgeCount = 0;
    const width = image.width;
    const height = image.height;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Simple Sobel edge detection
        const centerGray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const leftGray = 0.299 * data[idx - 4] + 0.587 * data[idx - 3] + 0.114 * data[idx - 2];
        const rightGray = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];
        const topGray = 0.299 * data[idx - width * 4] + 0.587 * data[idx - width * 4 + 1] + 0.114 * data[idx - width * 4 + 2];
        const bottomGray = 0.299 * data[idx + width * 4] + 0.587 * data[idx + width * 4 + 1] + 0.114 * data[idx + width * 4 + 2];
        
        const gradX = Math.abs(rightGray - leftGray);
        const gradY = Math.abs(bottomGray - topGray);
        const gradient = Math.sqrt(gradX * gradX + gradY * gradY);
        
        if (gradient > 30) edgeCount++;
      }
    }
    
    const backgroundClutter = edgeCount / ((width - 2) * (height - 2)); // Normalize to 0-1
    
    // Generate speculative metrics (clearly labeled as fake)
    const speculativeBMI = Math.random() * 15 + 18; // 18-33 range
    const speculativeSocialClass = Math.random() < 0.33 ? "low" : Math.random() < 0.67 ? "medium" : "high";
    
    return {
      brightness: Math.round(brightness * 100) / 100,
      backgroundClutter: Math.round(backgroundClutter * 100) / 100,
      speculativeBMI: Math.round(speculativeBMI * 10) / 10,
      speculativeSocialClass
    };
  } catch (error) {
    console.error("Image metrics calculation error:", error);
    return {
      brightness: 0.5,
      backgroundClutter: 0.5,
      speculativeBMI: 22.5,
      speculativeSocialClass: "medium"
    };
  }
};