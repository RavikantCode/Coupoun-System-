import mongoose from 'mongoose';
import { User } from '../lib/Schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB connection string is not defined');
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const adminUser = {
            email: 'ravikant@abc.com',
            password: 'ravi',
            role: 'admin'
        };

        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const newAdmin = new User(adminUser);
        await newAdmin.save();
        console.log('Admin user created successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin(); 