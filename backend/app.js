import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import User from './models/user.models.js'; // Adjust the path as necessary
import Formroutes from './routes/Form.routes.js';
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Update for production
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/form', Formroutes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});

// MongoDB Connection
mongoose.connect('mongodb+srv://nidhimkumar2004:ozlJZo5H6uJ5GnSq@cluster0.zlgrm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes