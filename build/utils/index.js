"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const otp_service_1 = __importDefault(require("../services/otp.service"));
class UtilsFunc {
}
_a = UtilsFunc;
UtilsFunc.generateOtp = async ({ user_id }) => {
    const otp = Math.floor(Math.random() * 8999 + 1000);
    const ttl = 15 * 60 * 1000;
    const expires_in = new Date(Date.now() + ttl);
    const check_otp = await otp_service_1.default.getOtpByUser({ user_id });
    if (!check_otp) {
        return otp_service_1.default.createOtp({ otp, expires_in, user_id });
    }
    else {
        return otp_service_1.default.updateOtp({ otp, expires_in, user_id });
    }
};
exports.default = UtilsFunc;
