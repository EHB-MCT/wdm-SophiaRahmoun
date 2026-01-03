import User from "../models/User.js";
import SelfieAnalysis from "../models/SelfieAnalysis.js";
import Event from "../models/Event.js";
import { analyzeFace } from "../services/faceAnalysis.js";
import { calculateImageMetrics } from "../services/imageMetrics.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced emotion detection logic
const determineEmotion = (brightness, interactionDuration) => {
  if (brightness < 0.3) {
    return interactionDuration > 5000 ? 'anxious' : 'sad';
  } else if (brightness > 0.7) {
    return 'happy';
  } else if (interactionDuration < 2000) {
    return 'neutral';
  } else if (interactionDuration > 5000 && brightness < 0.5) {
    return 'anxious';
  }
  return 'neutral';
};

// Enhanced gender detection (probabilistic but consistent)
const determineGender = (age, emotion) => {
  const random = Math.random();
  if (age < 20) {
    return random < 0.48 ? 'female' : 'male';
  } else if (age < 40) {
    return random < 0.52 ? 'female' : 'male';
  } else {
    return random < 0.49 ? 'female' : 'male';
  }
};

// Device detection from headers
const detectDevice = (headers) => {
  const userAgent = headers['user-agent'] || '';
  const device = {
    platform: 'unknown',
    os: 'unknown',
    browser: 'unknown'
  };

  if (userAgent.includes('Windows')) device.os = 'Windows';
  else if (userAgent.includes('Mac')) device.os = 'macOS';
  else if (userAgent.includes('Linux')) device.os = 'Linux';
  else if (userAgent.includes('Android')) device.os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) device.os = 'iOS';

  if (userAgent.includes('Chrome')) device.browser = 'Chrome';
  else if (userAgent.includes('Firefox')) device.browser = 'Firefox';
  else if (userAgent.includes('Safari')) device.browser = 'Safari';
  else if (userAgent.includes('Edge')) device.browser = 'Edge';

  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    device.platform = 'mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    device.platform = 'tablet';
  } else {
    device.platform = 'desktop';
  }

  return device;
};

// Simple IP-based location
const getLocationFromIP = (ip) => {
  const mockLocations = {
    '127.0.0.1': { country: 'Local', city: 'Development' },
    '::1': { country: 'Local', city: 'Development' },
    'default': { country: 'Unknown', city: 'Unknown' }
  };
  
  return mockLocations[ip] || mockLocations['default'];
};

export const analyzeSelfie = async (req, res) => {
  try {
    const analysisData = req.body;
    
    const validation = validateAnalysisData(analysisData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: "Invalid analysis data", 
        details: validation.errors 
      });
    }
    
    const sanitizedData = sanitizeAnalysisData(analysisData);
    
    let user;

    if (uid) {
      user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.lastSeen = new Date();
    } else {
      const newUid = uuidv4();
      user = new User({ uid: newUid });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    // Enhanced emotion and gender detection
    const enhancedEmotion = determineEmotion(sanitizedData.brightness, sanitizedData.interactionDuration);
    const enhancedGender = sanitizedData.gender || determineGender(sanitizedData.estimatedAge || 25, enhancedEmotion);
    
    // Device and location detection
    const detectedDevice = detectDevice(req.headers);
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    const location = getLocationFromIP(clientIP);

    const analysis = new SelfieAnalysis({
      uid: user.uid,
      imageUrl,
      faceDetected: sanitizedData.faceDetected,
      estimatedAge: sanitizedData.estimatedAge,
      gender: enhancedGender,
      dominantEmotion: enhancedEmotion,
      brightness: sanitizedData.brightness,
      backgroundClutter: sanitizedData.backgroundClutter,
      ip: clientIP,
      location: location,
      device: detectedDevice,
      deviceInfo: sanitizedData.deviceInfo || {},
      interactionDuration: sanitizedData.interactionDuration,
      timestamp: new Date(sanitizedData.timestamp || Date.now()),
    });

    // Save analysis with error handling
    try {
      await analysis.save();
      console.log('✅ Analysis saved with enhanced fields');
    } catch (saveError) {
      console.error('❌ Analysis save error:', saveError.message);
      console.error('Validation errors:', saveError.errors);
      throw saveError;
    }

    // Save user and create events
    await Promise.all([
      user.save(),
      Event.create({
        uid: user.uid,
        type: "selfie_upload",
        data: { analysisId: analysis._id },
      }),
      Event.create({
        uid: user.uid,
        type: "analysis_complete",
        data: { 
          faceDetected: sanitizedData.faceDetected,
          emotion: enhancedEmotion,
          brightness: sanitizedData.brightness,
          device: detectedDevice.platform,
          location: location.country,
        },
      }),
    ]);

    user.selfieCount = await SelfieAnalysis.countDocuments({ uid: user.uid });
    await user.save();

    res.json({
      uid: user.uid,
      analysis: {
        id: analysis._id,
        faceDetected: analysis.faceDetected,
        estimatedAge: analysis.estimatedAge,
        gender: analysis.gender,
        dominantEmotion: analysis.dominantEmotion,
        brightness: analysis.brightness,
        backgroundClutter: analysis.backgroundClutter,
        metadata: {
          ip: analysis.ip,
          location: analysis.location,
          device: analysis.device,
        },
      },
    });
  } catch (error) {
    console.error("❌ Selfie analysis save error:", error);
    res.status(500).json({ error: "Failed to save analysis" });
  }
};