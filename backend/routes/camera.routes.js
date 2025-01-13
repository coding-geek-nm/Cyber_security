import express from "express";
import upload from "../middlewares/multer.js";
import { registerUser, verifyUser } from "../controllers/camera.controllers.js";

const router = express.Router();

// Route for user registration
router.post("/register", upload.single("file"), registerUser);

// Route for user verification
router.post("/verify", upload.single("file"), verifyUser);

export default router;
