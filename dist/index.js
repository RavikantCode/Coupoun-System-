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
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(request_ip_1.default.mw());
app.set("trust proxy", 1);
// Connect to database
(0, connectdb_1.default)().catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});
// Routes
app.get('/', (req, res) => {
    const ip = request_ip_1.default.getClientIp(req);
    res.json({
        message: 'Coupon Distribution API',
        clientIp: ip
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map