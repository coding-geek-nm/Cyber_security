import User from "../models/cameraverification.js";
import { verifyFace } from "../utils/verifiy.js";
// controllers/userController.js
import Camera from "../models/cameraverification.js";
import path from 'path';

export const registerUser = async (req, res) => {
  const { email, phone } = req.body;
  const imagePath = req.file.path;

  try {
    // Verify that the uploaded image contains a valid face
    try {
      await verifyFace(imagePath, imagePath);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid image: No face detected or image is not suitable for face verification" 
      });
    }

    const user = new User({ email, phone, imagePath });
    await user.save();
    
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const verifyUser = async (req, res) => {
    
  const { email } = req.body;
  if(!req.file) {
    return res.status(400).json({
        success: false,
        message: "Image file is required"
        });
    }
  const capturedImage = req.file.path;
  
  try {
    
    const user = await Camera.findOne({ email });
   
    // if (!user) {
    //   return res.status(404).json({ 
    //     success: false, 
    //     message: "User not found" 
    //   });
    // }
    console.log("User found", user);
    if (!user.imagePath) {
        console.log("User's image path is not defined");
        return res.status(400).json({
            success: false,
            message: "User's image path is not available",
        });
    }
    console.log("User's image path:", user.imagePath);
    const verificationResult = await verifyFace(capturedImage, user.imagePath);
    console.log("User found");
    res.json({
      success: verificationResult.verified,
      message: verificationResult.verified ? "Verification successful" : "Verification failed",
      confidence: {
        distance: verificationResult.distance,
        threshold: verificationResult.threshold
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};