"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Claim_1 = require("../utils/Claim");
const GetIp_1 = require("../utils/GetIp");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const Schema_1 = require("../lib/Schema");
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 3,
    message: 'Too many attempts, please try again later'
});
// Test route without rate limit for testing
router.post('/test-claim', Claim_1.claimCoupon);
// Reset coupon route for testing
router.post('/reset-coupon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }
        // Find the coupon
        const coupon = yield Schema_1.Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }
        // Delete all claims for this coupon
        const deletedClaims = yield Schema_1.CouponClaim.deleteMany({ Coupon_Id: coupon._id });
        // Reset the coupon status
        coupon.isClaimed = false;
        coupon.claimedById = undefined;
        coupon.is_Available = true;
        yield coupon.save();
        // Clear the cooldown cookie
        res.clearCookie('coupon_session');
        return res.status(200).json({
            success: true,
            message: `Reset coupon "${code}" successfully. Deleted ${deletedClaims.deletedCount} claim records.`,
            coupon
        });
    }
    catch (error) {
        console.error('Error resetting coupon:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset coupon'
        });
    }
}));
// Production routes with rate limit
router.get('/ip', GetIp_1.getIp);
router.post('/claim', limiter, Claim_1.claimCoupon);
exports.default = router;
