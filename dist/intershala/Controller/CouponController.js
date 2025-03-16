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
exports.DeleteCoupon = exports.ToggleCouponAvailability = exports.GetClaimHistory = exports.EditCoupon = exports.GetCoupon = exports.createCoupon = void 0;
const Schema_1 = require("../lib/Schema");
const mongoose_1 = __importDefault(require("mongoose"));
const createCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const existingCoupon = yield Schema_1.Coupon.findOne({ code });
        if (existingCoupon) {
            res.status(400).json({
                msg: 'Coupon code already exists'
            });
            return;
        }
        const coupon = yield Schema_1.Coupon.create({
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
});
exports.createCoupon = createCoupon;
const GetCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const coupon = yield Schema_1.Coupon.findById(id);
            if (!coupon) {
                res.status(404).json({
                    msg: 'Coupon not found'
                });
                return;
            }
            // Get claim history for this coupon
            const claims = yield Schema_1.CouponClaim.find({ Coupon_Id: id }).sort({ claimed_at: -1 });
            // Add claim history to the coupon object
            const couponWithHistory = Object.assign(Object.assign({}, coupon.toObject()), { claim_history: claims.map(claim => ({
                    user_id: 'Anonymous', // We don't track user IDs in our system
                    claimed_at: claim.claimed_at,
                    ip_address: claim.ip_address,
                    public_ip: claim.public_ip || 'Not available',
                    cookie_id: claim.cookie_id || 'Not available' // Ensure cookie_id is included with fallback
                })) });
            res.status(200).json({
                msg: 'Coupon fetched successfully',
                coupon: couponWithHistory
            });
            return;
        }
        // Otherwise fetch all coupons
        const coupons = yield Schema_1.Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({
            msg: 'Coupons fetched successfully',
            coupons
        });
    }
    catch (error) {
        next(error);
    }
});
exports.GetCoupon = GetCoupon;
const EditCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const existingCoupon = yield Schema_1.Coupon.findOne({
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
        const coupon = yield Schema_1.Coupon.findByIdAndUpdate(id, updateData, { new: true });
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
});
exports.EditCoupon = EditCoupon;
const GetClaimHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const claims = yield Schema_1.CouponClaim.find()
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
});
exports.GetClaimHistory = GetClaimHistory;
const ToggleCouponAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const coupon = yield Schema_1.Coupon.findOne({ code });
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }
        coupon.is_Available = !coupon.is_Available;
        yield coupon.save();
        res.status(200).json({
            msg: `Coupon ${coupon.is_Available ? 'enabled' : 'disabled'} successfully`,
            coupon
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ToggleCouponAvailability = ToggleCouponAvailability;
const DeleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }
        const coupon = yield Schema_1.Coupon.findOne({ code });
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }
        yield Schema_1.Coupon.deleteOne({ code });
        res.status(200).json({
            msg: 'Coupon deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DeleteCoupon = DeleteCoupon;
