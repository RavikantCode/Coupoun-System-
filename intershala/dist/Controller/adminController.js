"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const Schema_1 = require("../lib/Schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                msg: 'Email and password are required'
            });
            return;
        }
        const user = await Schema_1.User.findOne({ email });
        if (!user || user.password != password) {
            res.status(400).json({
                msg: "Invalid Credentials"
            });
            return;
        }
        if (user.role != 'admin') {
            res.status(400).json({
                msg: "Unauthorized"
            });
            return;
        }
        const tokenData = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(tokenData, process.env.JWT_SECRET || '', { expiresIn: '24h' });
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });
        res.json({
            msg: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
