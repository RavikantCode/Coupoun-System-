import { Router, Request, Response } from 'express';
import { claimCoupon } from '../utils/Claim';
import { getIp } from '../utils/GetIp';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';
import { Coupon, CouponClaim } from '../lib/Schema';

const router = Router();

router.use(cookieParser());

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3, 
    message: 'Too many attempts, please try again later'
}) as unknown as RequestHandler;

// Test route without rate limit for testing
router.post('/test-claim', claimCoupon as RequestHandler);

// Reset coupon route for testing
router.post('/reset-coupon', async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }
        
        // Find the coupon
        const coupon = await Coupon.findOne({ code });
        
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        
        // Delete all claims for this coupon
        const deletedClaims = await CouponClaim.deleteMany({ Coupon_Id: coupon._id });
        
        // Reset the coupon status
        coupon.isClaimed = false;
        coupon.claimedById = undefined;
        coupon.is_Available = true;
        await coupon.save();
        
        // Clear the cooldown cookie
        res.clearCookie('coupon_session');
        
        return res.status(200).json({
            success: true,
            message: `Reset coupon "${code}" successfully. Deleted ${deletedClaims.deletedCount} claim records.`,
            coupon
        });
    } catch (error) {
        console.error('Error resetting coupon:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset coupon'
        });
    }
});

// Production routes with rate limit
router.get('/ip', getIp as RequestHandler);
router.post('/claim', limiter, claimCoupon as RequestHandler);

export default router;
