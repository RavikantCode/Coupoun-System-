import { Request, Response } from "express";
import connectDb from "./lib/connectdb";
import express from 'express';
import requestIp from 'request-ip';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import AdminRoute from "./Route/AdminRoute";
import CouponRoute from "./Route/CouponRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://coupoun-system.onrender.com'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(requestIp.mw());
app.set("trust proxy", true);

connectDb();

app.use((req: Request, res: Response, next: Function) => {
    if (!req.cookies['coupon_session']) {
        res.cookie('coupon_session', Date.now().toString(), {
            maxAge: 30 *24* 60* 60 *1000,
            httpOnly: true,
        });
    }
    next();
});

app.use('/api/v1/admin', AdminRoute);
app.use('/api/v1/coupon', CouponRoute);

app.use((err: Error, _req: Request, res: Response, _next: Function) => {
    console.error(err);
    res.status(500).json({ 
        message: 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
