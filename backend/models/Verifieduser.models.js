import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    aadhaar: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

const  VerifiedUser= mongoose.model('VerifiedUser', userSchema);

export default VerifiedUser;
