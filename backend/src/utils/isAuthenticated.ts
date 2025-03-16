import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

interface AuthRequest extends Request {
    id?: string;
}

interface JWTPayload extends JwtPayload {
    userId: string;
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if(!token){
            res.status(401).json({
                msg: 'Authentication Failure',
                success: false
            });
            return;
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET || '') as JWTPayload;
        if(!decode){
            res.status(401).json({
                msg: "Invalid Token",
                success: false
            });
            return;
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        res.status(401).json({
            msg: "Authentication Error",
            success: false
        });
    }
};