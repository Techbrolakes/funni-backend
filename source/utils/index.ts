import { Types } from 'mongoose';
import { IOtp } from '../interfaces/otp.interface';
import otpService from '../services/otp.service';

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
}

export default UtilsFunc;
