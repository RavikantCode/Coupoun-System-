import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }

        await mongoose.connect(mongoUrl);
        console.log("MongoDB connected successfully");
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

export default connectDb;