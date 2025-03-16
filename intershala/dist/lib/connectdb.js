"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }
        await mongoose_1.default.connect(mongoUrl);
        console.log("MongoDB connected successfully");
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
exports.default = connectDb;
