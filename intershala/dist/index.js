"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectdb_1 = __importDefault(require("./lib/connectdb"));
const express_1 = __importDefault(require("express"));
const request_ip_1 = __importDefault(require("request-ip"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AdminRoute_1 = __importDefault(require("./Route/AdminRoute"));
const CouponRoute_1 = __importDefault(require("./Route/CouponRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, cookie_parser_1.default)());
app.use(request_ip_1.default.mw());
app.set("trust proxy", true);
(0, connectdb_1.default)();
app.use((req, res, next) => {
    if (!req.cookies['coupon_session']) {
        res.cookie('coupon_session', Date.now().toString(), {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
    }
    next();
});
app.use('/api/v1/admin', AdminRoute_1.default);
app.use('/api/v1/coupon', CouponRoute_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
