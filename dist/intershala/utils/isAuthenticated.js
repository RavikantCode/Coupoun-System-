"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isAuthenticated = (req, res, next) => {
    var _a;
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        if (!token) {
            res.status(401).json({
                msg: 'Authentication Failure',
                success: false
            });
            return;
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        if (!decode) {
            res.status(401).json({
                msg: "Invalid Token",
                success: false
            });
            return;
        }
        req.id = decode.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            msg: "Authentication Error",
            success: false
        });
    }
};
exports.isAuthenticated = isAuthenticated;
