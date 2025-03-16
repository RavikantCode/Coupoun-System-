"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });
const CouponClaimSchema = new mongoose_1.default.Schema({
    Coupon_Id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    coupon_code: { type: String, required: true },
    ip_address: { type: String, required: true },
    claimed_at: { type: Date, default: Date.now },
});
exports.default = { UserSchema, CouponSchema, CouponClaimSchema };
//# sourceMappingURL=Schema.js.map