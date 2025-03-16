import mongoose from "mongoose";

import { UserInterface,CouponInterface,CouponClaimInterface } from "./types";

const UserSchema = new mongoose.Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin','user'], default: 'user' }
});

const CouponSchema = new mongoose.Schema<CouponInterface>({
    code: { type: String, required: true, unique: true },
    is_Available: { type: Boolean, default: true },
    isClaimed: { type: Boolean, default: false },
    claimedById: { type: mongoose.Schema.Types.ObjectId, ref: 'CouponClaim' },
},{timestamps:true});

const CouponClaimSchema = new mongoose.Schema<CouponClaimInterface>({
    Coupon_Id:{type:mongoose.Schema.Types.ObjectId,ref:'Coupon',required:true},
    coupon_code: { type: String, required: true },
    ip_address: { type: String, required: true },
    public_ip: { type: String, default: 'Not available' },
    cookie_id: { type: String, required: true },
    claimed_at: { type: Date, default:Date.now},
});


export const User = mongoose.model('User',UserSchema);
export const Coupon = mongoose.model('Coupon',CouponSchema);
export const CouponClaim = mongoose.model('CouponClaim',CouponClaimSchema);
