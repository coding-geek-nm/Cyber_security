import dotenv from 'dotenv';
import twilio from 'twilio';
import User from '../models/user.models.js'; // Import User model

dotenv.config();

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

            // Generate a random 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Update the user's OTP in the database
            user.otp = otp;
            await user.save();

            // Send OTP via Twilio
            await client.messages.create({
                from:process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio number
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

            // OTP verification success
            res.status(200).send({ status: 'success', message: 'Login success' });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).send({ status: 'failed', message: 'Error verifying OTP' });
        }
    }
}

export default UserController;
