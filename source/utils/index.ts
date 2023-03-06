import { Types } from 'mongoose';
import otpService from '../services/otp.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UtilsFunc {
    // Generate OTP
    public static generateOtp = async ({ user_id }: { user_id: Types.ObjectId }) => {
        const otp = Math.floor(Math.random() * 8999 + 1000);
        const ttl = 15 * 60 * 1000;
        const expires_in = new Date(Date.now() + ttl);

        const check_otp = await otpService.getOtpByUser({ user_id });
        if (!check_otp) {
            return otpService.createOtp({ otp, expires_in, user_id });
        } else {
            return otpService.updateOtp({ otp, expires_in, user_id });
        }
    };

    // Generate Jwt token
    public static generateToken = (data: any) => {
        return jwt.sign(data, process.env.JWT_SECRET || 'jwt', {
            expiresIn: '30d',
        });
    };
}

export default UtilsFunc;
