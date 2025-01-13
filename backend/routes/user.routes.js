import express from 'express';
const router = express.Router();
import UserController from '../controllers/usercontroller.js';

router.post('/login', UserController.userLogin);
router.post('/verify', UserController.verifyOTP);
router.post('/secondverify', UserController.verifySecondStep); // Corrected method name

export default router;
