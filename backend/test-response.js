const express = require('express');
const mongoose = require('mongoose');
const SelfieAnalysis = require('./models/SelfieAnalysis.js');

const app = express();
app.use(express.json());

// Test endpoint
app.post('/test', async (req, res) => {
  try {
    const analysis = new SelfieAnalysis({
      uid: 'test-uid',
      faceDetected: true,
      estimatedAge: 25,
      gender: 'female',
      dominantEmotion: 'happy',
      brightness: 0.8,
      backgroundClutter: 0.2,
      ip: '127.0.0.1',
      location: { country: 'Local', city: 'Development' },
      device: { platform: 'desktop', os: 'macOS', browser: 'Chrome' },
      interactionDuration: 1500
    });
    
    await analysis.save();
    
    console.log('Saved analysis:', analysis);
    
    res.json({
      uid: analysis.uid,
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
      message: "Test analysis saved successfully",
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb://localhost:27017/selfie-analysis')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3001, () => console.log('Test server on 3001'));
})
.catch(err => console.error('MongoDB error:', err));