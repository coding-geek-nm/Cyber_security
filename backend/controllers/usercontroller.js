import dotenv from 'dotenv';
import twilio from 'twilio';
import User from '../models/user.models.js'; // Import User model
import VerifiedUser from '../models/Verifieduser.models.js'; // Import VerifiedUser model
import bcrypt from 'bcrypt';
dotenv.config();
import crypto from 'crypto';

// Use a pre-defined key from environment variables for consistency
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');  // Make sure to store and use the key securely
const algorithm = 'aes-256-cbc'; // AES encryption algorithm
const iv = crypto.randomBytes(16); // Initialization vector for AES

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

class UserController {
    // Method to send OTP
    static async userLogin(req, res) {
        const { phone, aadhaar } = req.body;

        // Validate input
        if (!phone || !aadhaar) {
            return res.status(400).send({ status: 'failed', message: 'Phone and Aadhaar are required' });
        }
        
        try {
            // Check if user exists and Aadhaar matches
            const user = await User.findOne({ phone, aadhaar });
 
            if (!user) {
                return res.status(404).send({ status: 'failed', message: 'User not found or Aadhaar does not match' });
            }
            
            if(user.Age<18){
                return res.status(404).send({ status: 'failed', message: 'User is not eligible' });
            }

            // Generate a random 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Update the user's OTP in the database
            user.otp = otp;
            await user.save();

            // Send OTP via Twilio
            await client.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio number
                body: `Your OTP is ${otp}`,
                to: phone,
            });

            res.status(200).send({ status: 'success', message: 'OTP sent successfully' });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).send({ status: 'failed', message: 'Error sending OTP' });
        }
    }

    // Method to verify OTP
    static async verifyOTP(req, res) {
        const { phone, otp } = req.body;

        // Validate input
        if (!phone || !otp) {
            return res.status(400).send({ status: 'failed', message: 'Phone and OTP are required' });
        }

        try {
            // Check if the OTP matches the user's record
            const user = await User.findOne({ phone, otp });

            if (!user) {
                return res.status(400).send({ status: 'failed', message: 'Invalid OTP' });
            }

            // Encryption function using AES
            const encrypt = (text) => {
                const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
                let encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                return { iv: iv.toString('hex'), encryptedData: encrypted };
            };

            const encrypted_adhar = encrypt(user.aadhaar);
            const encrypted_phone = encrypt(user.phone);

            // Create a new VerifiedUser with encrypted details
            const verifiedUser = new VerifiedUser({
                phone: encrypted_phone.encryptedData,
                aadhaar: encrypted_adhar.encryptedData,
                iv: encrypted_phone.iv  // Store IV for later decryption
            });

            await verifiedUser.save();

            res.status(200).send({ status: 'success', message: 'OTP verified successfully' });

        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).send({ status: 'failed', message: 'Error verifying OTP' });
        }
    }
}

export default UserController;
