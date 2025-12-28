import faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

const loadModels = async () => {
  if (modelsLoaded) return;
  
  const modelPath = path.join(__dirname, "../models");
  try {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
    await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
    modelsLoaded = true;
    console.log("✅ Face analysis models loaded");
  } catch (error) {
    console.error("❌ Failed to load face models:", error.message);
    console.log("📁 Please place model files in backend/models/");
    console.log("📁 Required files: tiny_face_detector_model.weights, age_gender_model.weights, face_expression_model.weights");
  }
};

export const analyzeFace = async (imagePath) => {
  await loadModels();
  
  if (!modelsLoaded) {
    return {
      faceDetected: false,
      error: "Models not loaded"
    };
  }

  try {
    const image = await canvas.loadImage(imagePath);
    const detections = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();

    if (detections.length === 0) {
      return {
        faceDetected: false,
        estimatedAge: null,
        gender: "unknown",
        dominantEmotion: "unknown"
      };
    }

    const detection = detections[0];
    const emotions = detection.expressions;
    const dominantEmotion = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );

    return {
      faceDetected: true,
      estimatedAge: Math.round(detection.age),
      gender: detection.gender,
      dominantEmotion
    };
  } catch (error) {
    console.error("Face analysis error:", error);
    return {
      faceDetected: false,
      error: error.message
    };
  }
};