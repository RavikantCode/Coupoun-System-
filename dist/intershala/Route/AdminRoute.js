"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../Controller/adminController");
const CouponController_1 = require("../Controller/CouponController");
const isAuthenticated_1 = require("../utils/isAuthenticated");
const router = (0, express_1.Router)();
router.post('/login', adminController_1.login);
router.use(isAuthenticated_1.isAuthenticated);
router.post('/create-coupon', CouponController_1.createCoupon);
router.get('/coupons', CouponController_1.GetCoupon);
router.route('/edit-coupon/:id')
    .get(CouponController_1.GetCoupon)
    .put(CouponController_1.EditCoupon);
router.get('/claim-history', CouponController_1.GetClaimHistory);
router.post('/toggle-coupon', CouponController_1.ToggleCouponAvailability);
router.post('/delete-coupon', CouponController_1.DeleteCoupon);
exports.default = router;
