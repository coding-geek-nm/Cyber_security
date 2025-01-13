// utils/faceApiConfig.js
import * as faceapi from 'face-api.js';
import { Canvas, createCanvas, Image, ImageData } from 'canvas';
import path from 'path';

// Configure face-api to use node-canvas
const canvas = createCanvas(1000, 1000);
const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ 
    minConfidence: 0.5 
});

// Initialize nodejs canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Model paths configuration
const modelPathRoot = path.join(process.cwd(), 'model');
const modelPaths = {
    ssdMobilenetv1: path.join(modelPathRoot, 'ssd_mobilenetv1_model'),
    faceLandmark68: path.join(modelPathRoot, 'face_landmark_68_model'),
    faceRecognition: path.join(modelPathRoot, 'face_recognition_model')
};

// Function to load all required models
const loadRequiredModels = async () => {
    try {
        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPaths.ssdMobilenetv1),
            faceapi.nets.faceLandmark68Net.loadFromDisk(modelPaths.faceLandmark68),
            faceapi.nets.faceRecognitionNet.loadFromDisk(modelPaths.faceRecognition)
        ]);
        console.log('All models loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading models:', error);
        throw new Error('Failed to load face-api models');
    }
};

export {
    canvas,
    faceDetectionOptions,
    modelPaths,
    loadRequiredModels
};