export const estimateGender = ({
    brightness,
    backgroundClutter,
    interactionDuration,
    deviceInfo,
  }) => {
    let score = 0;
  
    // brightness = selfcare
    if (brightness > 0.45) score += 1;
  
    // clean background = attention to details
    if (backgroundClutter < 0.35) score += 1;
  
    // long time = patience / perseverance
    if (interactionDuration > 5000) score += 1;
  
    // mobile = biased
    if (deviceInfo?.platform === "ios") score += 0.5;
  
    if (score >= 2) return "female";
    if (score <= 1) return "male";
  
    return "unknown";
  };
  
  export const estimateEmotion = ({
    brightness,
    interactionDuration,
    hour,
    retakeCount = 0,
  }) => {
    //night = tired
    if (hour >= 23 || hour <= 5) return "neutral";
  
    if (brightness < 0.35 && interactionDuration > 6000) return "sad";
  
    if (retakeCount >= 2) return "neutral";
  
    if (brightness > 0.6 && interactionDuration < 3000) return "happy";
  
    if (interactionDuration > 9000) return "fearful";
  
    return "neutral";
  };