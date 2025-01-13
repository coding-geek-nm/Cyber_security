import mongoose from "mongoose";

const CameraSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    imagePath: { type: String, required: true },
  });
  
  
const Camera = mongoose.model("Camera", CameraSchema);
export default Camera;