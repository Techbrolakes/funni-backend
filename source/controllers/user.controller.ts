import { Response } from 'express';
import { ExpressRequest } from '../server';
import { IRegister, IVerifyMail } from '../interfaces/user.interface';
import ResponseHandler from '../utils/response-handler';
import userService from '../services/user.service';
import { Types } from 'mongoose';
import UtilsFunc from '../utils';
import { sendWelcomeEmail } from '../services/mail.service';
import otpService from '../services/otp.service';

/******
 *
 *
 * Register Email
 */
export const Register = async (req: ExpressRequest, res: Response): Promise<Response> => {
    const { first_name, last_name, email, password, confirm_password, phone_number }: IRegister = req.body;

    try {
        const existingUser = await userService.getByEmail({ email: email.toLowerCase() });
        if (existingUser) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: `${email} is already taken` });
        }
        if (password !== confirm_password) {
            return ResponseHandler.sendErrorResponse({ res, code: 400, error: 'Passwords mismatch' });
        }
        const user = await userService.createUser({
            first_name: first_name.charAt(0).toUpperCase() + first_name.slice(1),
            last_name: last_name.charAt(0).toUpperCase() + last_name.slice(1),
            email: email.toLowerCase(),
            password,
            confirm_password,
            phone_number,
        });
        const user_id = new Types.ObjectId(String(user._id));
        // SAVE OTP
        const otp = await UtilsFunc.generateOtp({ user_id });
        await sendWelcomeEmail({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to FurniZen',
        });

        return ResponseHandler.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Verify Email
 */
export const verifyEmail = async (req: ExpressRequest, res: Response) => {
    const { email, otp }: IVerifyMail = req.body;
    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });

        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const verifyOtp = await otpService.verifyOtp({ otp, user_id: user._id });
        if (!verifyOtp.status) {
            return ResponseHandler.sendErrorResponse({ res, code: 400, error: verifyOtp.message });
        }
        const token = await UtilsFunc.generateToken({
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        });

        await userService.atomicUpdate(user._id, {
            $set: {
                verified_email: true,
                verified_email_at: new Date(),
            },
        });

        const data = {
            token,
            ...user,
        };

        return ResponseHandler.sendSuccessResponse({ res, code: 201, message: 'Email verified successfully', data });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Resend Verification
 */

export const resendVerification = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    const { email }: { email: string } = req.body;

    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        const otp = await UtilsFunc.generateOtp({ user_id: user._id });
        await sendWelcomeEmail({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to FurniZen',
        });

        return ResponseHandler.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
