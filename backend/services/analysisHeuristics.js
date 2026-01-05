export function estimateGender({ brightness, backgroundClutter }) {
    if (brightness > 0.6 && backgroundClutter < 0.4) return "female";
    if (brightness < 0.4) return "male";
    return "unknown";
  }
  
  export function estimateEmotion({ brightness, interactionDuration }) {
    if (brightness < 0.3) return "sad";
    if (interactionDuration > 5000) return "neutral";
    return "happy";
  }