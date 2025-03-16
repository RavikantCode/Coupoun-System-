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
const axios_1 = __importDefault(require("axios"));
function testClaim() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            // Test 1: First claim should succeed
            console.log('Test 1: First claim attempt...');
            const response1 = yield axios_1.default.post('http://localhost:5000/api/v1/coupon/test-claim', {}, {
                headers: {
                    'Cookie': 'coupon_session=test123'
                }
            });
            console.log('Test 1 Result:', response1.data);
            // Test 2: Second claim should fail (cooldown)
            console.log('\nTest 2: Second claim attempt (should fail due to cooldown)...');
            try {
                const response2 = yield axios_1.default.post('http://localhost:5000/api/v1/coupon/test-claim', {}, {
                    headers: {
                        'Cookie': 'coupon_session=test123'
                    }
                });
                console.log('Test 2 Result (unexpected success):', response2.data);
            }
            catch (error) {
                console.log('Test 2 Result (expected failure):', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
            }
            // Test 3: Claim with different session
            console.log('\nTest 3: Claim with different session...');
            try {
                const response3 = yield axios_1.default.post('http://localhost:5000/api/v1/coupon/test-claim', {}, {
                    headers: {
                        'Cookie': 'coupon_session=different123'
                    }
                });
                console.log('Test 3 Result:', response3.data);
            }
            catch (error) {
                console.log('Test 3 Result:', (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
            }
        }
        catch (error) {
            console.error('Test failed:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        }
    });
}
// Run the tests
console.log('Starting claim tests...');
testClaim().then(() => console.log('Tests completed'));
