import { Request, Response, NextFunction } from 'express';
import { Coupon, CouponClaim } from '../lib/Schema';
import mongoose from 'mongoose';

export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code } = req.body;
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            res.status(400).json({
                msg: 'Coupon code already exists'
            });
            return;
        }
        const coupon = await Coupon.create({
            code,
            is_Available: true,
            isClaimed: false
        });

        res.status(201).json({
            msg: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        next(error);
    }
};

export const GetCoupon = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (req.params.id) {
            const id = req.params.id;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({
                    msg: 'Invalid coupon ID format'
                });
                return;
            }

            const coupon = await Coupon.findById(id);
            if (!coupon) {
                res.status(404).json({
                    msg: 'Coupon not found'
                });
                return;
            }

    
            const claims = await CouponClaim.find({ Coupon_Id: id }).sort({ claimed_at: -1 });
            
            const couponWithHistory = {
                ...coupon.toObject(),
                claim_history: claims.map(claim => ({
                    user_id: 'Anonymous',
                    claimed_at: claim.claimed_at,
                    ip_address: claim.ip_address,
                    public_ip: claim.public_ip || 'Not available',
                    cookie_id: claim.cookie_id || 'Not available'
                }))
            };

            res.status(200).json({
                msg: 'Coupon fetched successfully',
                coupon: couponWithHistory
            });
            return;
        }

        const coupons = await Coupon.find().sort({createdAt: -1});
        res.status(200).json({
            msg: 'Coupons fetched successfully',
            coupons
        });
    } catch (error) {
        next(error);
    }
};

export const EditCoupon = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                msg: 'Invalid coupon ID format'
            });
            return;
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({
                msg: 'Update data is required'
            });
            return;
        }

        if (updateData.code) {
            const existingCoupon = await Coupon.findOne({ 
                code: updateData.code,
                _id: { $ne: id }
            });
            if (existingCoupon) {
                res.status(400).json({
                    msg: 'Coupon code already exists'
                });
                return;
            }
        }

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
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
    } catch (error) {
        next(error);
    }
};

export const GetClaimHistory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const claims = await CouponClaim.find()
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
    } catch (error) {
        next(error);
    }
};

export const ToggleCouponAvailability = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code } = req.body;
        if(!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }

        const coupon = await Coupon.findOne({ code });
        if(!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }

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
    } catch (error) {
        next(error);
    }
};

export const DeleteCoupon = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code } = req.body;
        
        if (!code) {
            res.status(400).json({
                msg: 'Coupon code is required'
            });
            return;
        }

        const coupon = await Coupon.findOne({ code });
        
        if (!coupon) {
            res.status(404).json({
                msg: 'Coupon not found'
            });
            return;
        }

        await Coupon.deleteOne({ code });

        res.status(200).json({
            msg: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const claimCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const availableCoupon = await Coupon.findOne({
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
  
        if (!req.cookies.coupon_session) {
            res.cookie('coupon_session', cookie_id, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });
        }

        const claim = await CouponClaim.create({
            Coupon_Id: availableCoupon._id,
            coupon_code: availableCoupon.code,
            ip_address,
            public_ip,
            cookie_id,
            claimed_at: new Date()
        });

        availableCoupon.isClaimed = true;
        availableCoupon.is_Available = false; 
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

    } catch (error) {
        console.error('Error claiming coupon:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to claim coupon'
        });
    }
};


