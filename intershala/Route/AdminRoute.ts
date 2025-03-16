import { Router } from 'express';
import { login } from '../Controller/adminController';
import { 
    createCoupon, 
    GetCoupon, 
    EditCoupon, 
    GetClaimHistory,
    ToggleCouponAvailability,
    DeleteCoupon
} from '../Controller/CouponController';
import { isAuthenticated } from '../utils/isAuthenticated';
import { RequestHandler } from 'express';

const router = Router();

router.post('/login', login as RequestHandler);

router.use(isAuthenticated as RequestHandler);

router.post('/create-coupon', createCoupon as RequestHandler);
router.get('/coupons', GetCoupon as RequestHandler);
router.route('/edit-coupon/:id')
    .get(GetCoupon as RequestHandler)
    .put(EditCoupon as RequestHandler);
router.get('/claim-history', GetClaimHistory as RequestHandler);
router.post('/toggle-coupon', ToggleCouponAvailability as RequestHandler);
router.post('/delete-coupon', DeleteCoupon as RequestHandler);

export default router;