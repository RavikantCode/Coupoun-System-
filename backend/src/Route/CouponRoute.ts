import { Router, Request, Response } from 'express';
import { claimCoupon } from '../utils/Claim';
import { getIp } from '../utils/GetIp';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';

const router = Router();

router.use(cookieParser());

const limiter = rateLimit({           //added rate limiter so user can't claim coupon more than once in 24 hours 
    windowMs: 24 * 60 * 60 * 1000,
    max: 1, 
    message: 'Too many attempts, please try again later'
}) as unknown as RequestHandler;

router.get('/ip', getIp as RequestHandler);
router.post('/claim', limiter, claimCoupon as RequestHandler);

export default router;
