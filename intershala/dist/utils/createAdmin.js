"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema_1 = require("../lib/Schema");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const createAdmin = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB connection string is not defined');
        }
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
        const adminUser = {
            email: 'ravikant@abc.com',
            password: 'ravi',
            role: 'admin'
        };
        const existingAdmin = await Schema_1.User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        const newAdmin = new Schema_1.User(adminUser);
        await newAdmin.save();
        console.log('Admin user created successfully');
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
};
createAdmin();
