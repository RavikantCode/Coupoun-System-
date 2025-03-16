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
const mongoose_1 = require("mongoose");
const Schema_1 = require("./lib/Schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createTestCoupons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield (0, mongoose_1.connect)(process.env.MONGO_URL || '');
            console.log('Connected to MongoDB');
            // Create test coupons
            const testCoupons = [
                { code: 'TEST1', is_Available: true, isClaimed: false },
                { code: 'TEST2', is_Available: true, isClaimed: false },
                { code: 'TEST3', is_Available: true, isClaimed: false }
            ];
            // Clear existing test coupons
            yield Schema_1.Coupon.deleteMany({ code: /^TEST/ });
            // Insert new test coupons
            yield Schema_1.Coupon.insertMany(testCoupons);
            console.log('Test coupons created successfully');
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            process.exit(0);
        }
    });
}
createTestCoupons();
