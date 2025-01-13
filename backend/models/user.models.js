import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true},
    aadhaar: { type: String, required: true},
    Age: { type: Number },
    otp: { type: String },
    secondverificationnumber: { type: [Number] },
    correctNumber: { type: Number } // Correct number for second verification
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

export default User;
