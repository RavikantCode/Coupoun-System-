"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponClaim = exports.Coupon = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});
const CouponSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    is_Available: { type: Boolean, default: true },
    isClaimed: { type: Boolean, default: false },
    claimedById: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'CouponClaim' },
}, { timestamps: true });
const CouponClaimSchema = new mongoose_1.default.Schema({
    Coupon_Id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    coupon_code: { type: String, required: true },
    ip_address: { type: String, required: true },
    public_ip: { type: String, default: 'Not available' },
    cookie_id: { type: String, required: true },
    claimed_at: { type: Date, default: Date.now },
});
exports.User = mongoose_1.default.model('User', UserSchema);
exports.Coupon = mongoose_1.default.model('Coupon', CouponSchema);
exports.CouponClaim = mongoose_1.default.model('CouponClaim', CouponClaimSchema);
