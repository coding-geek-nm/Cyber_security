// utils/faceVerification.js
import * as faceapi from 'face-api.js';
import { loadRequiredModels, faceDetectionOptions, canvas } from './faceApiConfig.js';
import { createCanvas, loadImage } from 'canvas';

// Function to detect face and get descriptors
const getFaceDescriptor = async (imagePath) => {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const detection = await faceapi
      .detectSingleFace(canvas, faceDetectionOptions)  // Using the configured options
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in the image');
    }

    return detection.descriptor;
  } catch (error) {
    throw new Error(`Error processing image: ${error.message}`);
  }
};

// Function to verify faces
export const verifyFace = async (capturedImage, storedImage) => {
  try {
    // Use the configured model loading function
    await loadRequiredModels();

    const descriptor1 = await getFaceDescriptor(capturedImage);
    const descriptor2 = await getFaceDescriptor(storedImage);

    // Calculate the Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    
    // Threshold for face matching (you can adjust this value)
    const threshold = 0.6;
    
    return {
      verified: distance < threshold,
      distance: distance,
      threshold: threshold
    };
  } catch (error) {
    console.error('Error during face verification:', error);
    throw error;
  }
};