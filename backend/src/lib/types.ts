import mongoose from "mongoose";

export interface UserInterface extends mongoose.Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}


export interface CouponInterface extends mongoose.Document {
    code: string;
    is_Available: boolean;
    isClaimed: boolean;
    distributionOrder: number;
    claimedById?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface CouponClaimInterface extends mongoose.Document {
    Coupon_Id: mongoose.Types.ObjectId;
    coupon_code: string;
    ip_address: string;
    public_ip: string;
    cookie_id: string;
    claimed_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

