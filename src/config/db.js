const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the application if the connection fails
    }
};

module.exports = connectDB;