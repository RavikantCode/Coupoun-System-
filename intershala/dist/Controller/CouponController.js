"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimCoupon = exports.DeleteCoupon = exports.ToggleCouponAvailability = exports.GetClaimHistory = exports.EditCoupon = exports.GetCoupon = exports.createCoupon = void 0;
const Schema_1 = require("../lib/Schema");
const mongoose_1 = __importDefault(require("mongoose"));
const createCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const existingCoupon = await Schema_1.Coupon.findOne({ code });
        if (existingCoupon) {
            res.status(400).json({
                msg: 'Coupon code already exists'
            });
            return;
        }
        const coupon = await Schema_1.Coupon.create({
            code,
            is_Available: true,
            isClaimed: false
        });
        res.status(201).json({
            msg: 'Coupon created successfully',
            coupon
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCoupon = createCoupon;
const GetCoupon = async (req, res, next) => {
    try {
        // If ID is provided in params, fetch single coupon
        if (req.params.id) {
            const id = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    msg: 'Invalid coupon ID format'
                });
                return;
            }
            const coupon = await Schema_1.Coupon.findById(id);
            if (!coupon) {
                res.status(404).json({
                    msg: 'Coupon not found'
                });
                return;
            }
            // Get claim history for this coupon
            const claims = await Schema_1.CouponClaim.find({ Coupon_Id: id }).sort({ claimed_at: -1 });
            // Add claim history to the coupon object
            const couponWithHistory = {
                ...coupon.toObject(),
                claim_history: claims.map(claim => ({
                    user_id: 'Anonymous', // We don't track user IDs in our system
                    claimed_at: claim.claimed_at,
                    ip_address: claim.ip_address,
                    public_ip: claim.public_ip || 'Not available',
                    cookie_id: claim.cookie_id || 'Not available' // Ensure cookie_id is included with fallback
                }))
            };
            res.status(200).json({
                msg: 'Coupon fetched successfully',
                coupon: couponWithHistory
            });
            return;
        }
        // Otherwise fetch all coupons
        const coupons = await Schema_1.Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({
            msg: 'Coupons fetched successfully',
            coupons
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetCoupon = GetCoupon;
const EditCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                msg: 'Invalid coupon ID format'
            });
            return;
        }
        // Validate update data
        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({
                msg: 'Update data is required'
            });
            return;
        }
        // Check if updating code and if it already exists
        if (updateData.code) {
            const existingCoupon = await Schema_1.Coupon.findOne({
                code: updateData.code,
                _id: { $ne: id } // Exclude current coupon
            });
            if (existingCoupon) {
                res.status(400).json({
                    msg: 'Coupon code already exists'
                });
                return;
            }
        }
        const coupon = await Schema_1.Coupon.findByIdAndUpdate(id, updateData, { new: true });
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }
        res.status(200).json({
            msg: 'Coupon updated successfully',
            coupon
        });
    }
    catch (error) {
        next(error);
    }
};
exports.EditCoupon = EditCoupon;
const GetClaimHistory = async (req, res, next) => {
    try {
        const claims = await Schema_1.CouponClaim.find()
            .sort({ claimed_at: -1 })
            .populate('Coupon_Id', 'code');
        res.status(200).json({
            msg: 'Claim history fetched successfully',
            claims: claims.map(claim => ({
                coupon_code: claim.coupon_code,
                ip_address: claim.ip_address,
                public_ip: claim.public_ip || 'Not available',
                cookie_id: claim.cookie_id,
                claimed_at: claim.claimed_at
            }))
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetClaimHistory = GetClaimHistory;
const ToggleCouponAvailability = async (req, res, next) => {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const coupon = await Schema_1.Coupon.findOne({ code });
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }
        // If coupon is claimed, don't allow making it available again
        if (coupon.isClaimed && req.body.is_Available === true) {
            res.status(400).json({
                msg: 'Cannot make claimed coupon available again'
            });
            return;
        }
        coupon.is_Available = !coupon.is_Available;
        await coupon.save();
        res.status(200).json({
            msg: `Coupon ${coupon.is_Available ? 'enabled' : 'disabled'} successfully`,
            coupon
        });
    }
    catch (error) {
        next(error);
    }
};
exports.ToggleCouponAvailability = ToggleCouponAvailability;
const DeleteCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const coupon = await Schema_1.Coupon.findOne({ code });
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }
        await Schema_1.Coupon.deleteOne({ code });
        res.status(200).json({
            msg: 'Coupon deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.DeleteCoupon = DeleteCoupon;
const claimCoupon = async (req, res, next) => {
    try {
        // Check for available coupon
        const availableCoupon = await Schema_1.Coupon.findOne({
            is_Available: true,
            isClaimed: false
        });
        if (!availableCoupon) {
            res.status(400).json({
                success: false,
                message: 'Sorry, all coupons are out of stock!'
            });
            return;
        }
        // Double check before claiming
        if (!availableCoupon.is_Available) {
            res.status(400).json({
                success: false,
                message: 'This coupon is no longer available'
            });
            return;
        }
        const ip_address = req.ip || req.socket.remoteAddress || 'Unknown';
        const public_ip = req.headers['x-forwarded-for'] || ip_address;
        const cookie_id = req.cookies.coupon_session || Date.now().toString();
        // Set cookie if it doesn't exist
        if (!req.cookies.coupon_session) {
            res.cookie('coupon_session', cookie_id, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });
        }
        // Create claim record
        const claim = await Schema_1.CouponClaim.create({
            Coupon_Id: availableCoupon._id,
            coupon_code: availableCoupon.code,
            ip_address,
            public_ip,
            cookie_id,
            claimed_at: new Date()
        });
        // Update coupon status
        availableCoupon.isClaimed = true;
        availableCoupon.is_Available = false; // Changed back to is_Available
        await availableCoupon.save();
        const expires_at = new Date();
        expires_at.setHours(expires_at.getHours() + 24);
        res.status(200).json({
            success: true,
            message: 'Coupon claimed successfully!',
            coupon: {
                code: availableCoupon.code,
                claimed_at: claim.claimed_at,
                expires_at: expires_at
            }
        });
    }
    catch (error) {
        console.error('Error claiming coupon:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to claim coupon'
        });
    }
};
exports.claimCoupon = claimCoupon;
