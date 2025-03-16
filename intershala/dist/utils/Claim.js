"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimCoupon = void 0;
const Schema_1 = require("../lib/Schema");
const axios_1 = __importDefault(require("axios"));
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000;
const claimCoupon = async (req, res, next) => {
    try {
        // Get local IP
        const local_ip = req.ip || req.socket.remoteAddress || '::1';
        // Try to get public IP
        let public_ip = '';
        try {
            const response = await axios_1.default.get('https://api.ipify.org?format=json');
            public_ip = response.data.ip;
        }
        catch (error) {
            console.log('Could not fetch public IP:', error);
            public_ip = 'Not available';
        }
        const cookie_id = req.cookies['coupon_session'];
        if (!cookie_id) {
            res.status(400).json({
                success: false,
                message: 'Invalid request: Missing cookie'
            });
            return;
        }
        const recentClaim = await Schema_1.CouponClaim.findOne({
            cookie_id,
            claimed_at: { $gt: new Date(Date.now() - COOLDOWN_PERIOD) }
        });
        if (recentClaim) {
            const timeLeft = Math.ceil((COOLDOWN_PERIOD - (Date.now() - recentClaim.claimed_at.getTime())) / (1000 * 60 * 60));
            res.status(429).json({
                success: false,
                message: `Please wait ${timeLeft} hours before claiming another coupon`,
                nextAvailable: new Date(recentClaim.claimed_at.getTime() + COOLDOWN_PERIOD)
            });
            return;
        }
        const lastClaimedCoupon = await Schema_1.CouponClaim.findOne()
            .sort({ claimed_at: -1 })
            .populate('Coupon_Id');
        let nextCoupon;
        if (!lastClaimedCoupon) {
            nextCoupon = await Schema_1.Coupon.findOne({
                is_Available: true,
                isClaimed: false
            }).sort({ createdAt: 1 });
        }
        else {
            nextCoupon = await Schema_1.Coupon.findOne({
                _id: { $gt: lastClaimedCoupon.Coupon_Id },
                is_Available: true,
                isClaimed: false
            }).sort({ _id: 1 });
            if (!nextCoupon) {
                nextCoupon = await Schema_1.Coupon.findOne({
                    is_Available: true,
                    isClaimed: false
                }).sort({ _id: 1 });
            }
        }
        if (!nextCoupon) {
            res.status(404).json({
                success: false,
                message: 'No coupons available at the moment'
            });
            return;
        }
        const claim = await Schema_1.CouponClaim.create({
            Coupon_Id: nextCoupon._id,
            coupon_code: nextCoupon.code,
            ip_address: local_ip,
            public_ip: public_ip,
            cookie_id,
            claimed_at: new Date()
        });
        await Schema_1.Coupon.findByIdAndUpdate(nextCoupon._id, {
            claimedById: claim._id,
            isClaimed: true,
            is_Available: false
        });
        res.status(200).json({
            success: true,
            message: 'Coupon claimed successfully',
            coupon: {
                code: nextCoupon.code,
                claimed_at: claim.claimed_at,
                expires_at: new Date(claim.claimed_at.getTime() + COOLDOWN_PERIOD)
            }
        });
    }
    catch (error) {
        console.error('Claim error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to claim coupon'
        });
    }
};
exports.claimCoupon = claimCoupon;
