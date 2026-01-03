// Backend validation utilities for selfie analysis data

export const validateAnalysisData = (data) => {
  const errors = [];
  
  // UID validation (optional - backend will create if not provided)
  if (data.uid && (typeof data.uid !== 'string' || data.uid.trim() === '')) {
    errors.push('UID must be a valid string if provided');
  }
  
  if (typeof data.faceDetected !== 'boolean') {
    errors.push('faceDetected must be a boolean');
  }
  
  if (typeof data.brightness !== 'number' || data.brightness < 0 || data.brightness > 1) {
    errors.push('brightness must be a number between 0 and 1');
  }
  
  // Optional fields validation
  if (data.estimatedAge !== undefined) {
    if (typeof data.estimatedAge !== 'number' || data.estimatedAge < 0 || data.estimatedAge > 150) {
      errors.push('estimatedAge must be a valid age number');
    }
  }
  
  if (data.dominantEmotion !== undefined) {
    const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
    if (!validEmotions.includes(data.dominantEmotion)) {
      errors.push(`dominantEmotion must be one of: ${validEmotions.join(', ')}`);
    }
  }
  
  if (data.gender !== undefined) {
    const validGenders = ['male', 'female', 'unknown'];
    if (!validGenders.includes(data.gender)) {
      errors.push(`gender must be one of: ${validGenders.join(', ')}`);
    }
  }
  
  // Behavioral data validation
  if (data.deviceInfo && typeof data.deviceInfo !== 'object') {
    errors.push('deviceInfo must be an object');
  }
  
  if (data.interactionDuration !== undefined) {
    if (typeof data.interactionDuration !== 'number' || data.interactionDuration < 0) {
      errors.push('interactionDuration must be a positive number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeAnalysisData = (data) => {
  const sanitized = { ...data };
  
  // Remove any potentially harmful fields
  delete sanitized.__proto__;
  delete sanitized.constructor;
  delete sanitized.prototype;
  
  // Ensure proper data types
  sanitized.faceDetected = Boolean(sanitized.faceDetected);
  const clamp01 = (n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return 0;
    return Math.min(1, Math.max(0, v));
  };
  
  sanitized.brightness = clamp01(sanitized.brightness);
  sanitized.backgroundClutter = clamp01(sanitized.backgroundClutter);
  
  if (sanitized.estimatedAge !== undefined) {
    sanitized.estimatedAge = Math.round(Number(sanitized.estimatedAge));
  }
  
  if (sanitized.interactionDuration !== undefined) {
    sanitized.interactionDuration = Number(sanitized.interactionDuration);
  }
  
  return sanitized;
};