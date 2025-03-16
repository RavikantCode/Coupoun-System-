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
exports.getIp = void 0;
const axios_1 = __importDefault(require("axios"));
const getIp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get IP from various sources
        const localIp = req.ip || req.socket.remoteAddress;
        // For local development, try to get the public IP
        let publicIp = '';
        try {
            // Try to get public IP from a service (only in development)
            if (process.env.NODE_ENV !== 'production') {
                const response = yield axios_1.default.get('https://api.ipify.org?format=json');
                publicIp = response.data.ip;
            }
        }
        catch (error) {
            console.log('Could not fetch public IP:', error);
        }
        // Get cookie ID
        const cookie_id = req.cookies['coupon_session'] || '';
        // Set a cookie if it doesn't exist
        if (!cookie_id) {
            const newCookieId = Date.now().toString();
            res.cookie('coupon_session', newCookieId, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                sameSite: 'strict'
            });
        }
        res.json({
            message: 'Coupon Distribution API',
            localIp,
            publicIp: publicIp || 'Not available',
            cookie_id: cookie_id || 'Not set yet',
            note: 'For local development, you will see localhost IPs. In production, you will see real client IPs.'
        });
    }
    catch (error) {
        console.error('Error in getIp:', error);
        res.status(500).json({
            message: 'Error getting IP information',
            error: error.message || 'Unknown error'
        });
    }
});
exports.getIp = getIp;
