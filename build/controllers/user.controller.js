"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.verifyEmail = exports.resendVerification = exports.loginUser = exports.recoverPassword = exports.verifyOTP = exports.resetPassword = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const user_service_1 = __importDefault(require("../services/user.service"));
const mongoose_1 = require("mongoose");
const utils_1 = __importDefault(require("../utils"));
const mail_service_1 = require("../services/mail.service");
const otp_service_1 = __importDefault(require("../services/otp.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPassword = async (req, res) => {
    const { token, new_password, confirm_password } = req.body;
    try {
        const verify_token = await utils_1.default.verifyToken(token);
        const user = await user_service_1.default.getByEmail({ email: verify_token.email });
        if (!user) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        }
        if (!user.verified_email) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Email is not verified already' });
        }
        if (user.is_disabled) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        if (new_password !== confirm_password) {
            return response_handler_1.default.sendErrorResponse({ res, code: 400, error: `Passwords mismatch` });
        }
        const hash = bcrypt_1.default.hashSync(new_password, 10);
        await user_service_1.default.atomicUpdate(user._id, { $set: { password: hash } });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: 200,
            message: 'Your password has been successfully updated',
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.resetPassword = resetPassword;
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (!user)
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.is_disabled) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const verifyOtp = await otp_service_1.default.verifyOtp({ otp, user_id: user._id });
        if (!verifyOtp.status) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: 400,
                error: verifyOtp.message,
            });
        }
        const token = await utils_1.default.generateToken({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        const data = { token };
        return response_handler_1.default.sendSuccessResponse({ res, code: 200, message: 'OTP Verification successful.', data });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.verifyOTP = verifyOTP;
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (!user)
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.is_disabled) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const otp = await utils_1.default.generateOtp({ user_id: user._id });
        await (0, mail_service_1.sendPasswordRecoveryEmail)({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'FurniZen Password Recovery',
        });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: 200,
            message: 'A reset email has been sent to ' + email + '.',
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.recoverPassword = recoverPassword;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (!user)
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (!user.verified_email) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: 'Email is not verified yet',
                data: {
                    verified_email: false,
                },
            });
        }
        if (user.is_disabled) {
            return response_handler_1.default.sendErrorResponse({ res, code: 403, error: 'User Account is disabled' });
        }
        const result = bcrypt_1.default.compareSync(password, user?.password);
        if (!result) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: 400,
                error: 'Password is incorrect',
            });
        }
        const token = await utils_1.default.generateToken({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        const data = { token, ...user };
        return response_handler_1.default.sendSuccessResponse({ res, code: 200, message: 'Login successful', data });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.loginUser = loginUser;
const resendVerification = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (!user)
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        const otp = await utils_1.default.generateOtp({ user_id: user._id });
        await (0, mail_service_1.sendWelcomeEmail)({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to FurniZen',
        });
        return response_handler_1.default.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.resendVerification = resendVerification;
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (!user)
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        if (user.is_disabled) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const verifyOtp = await otp_service_1.default.verifyOtp({ otp, user_id: user._id });
        if (!verifyOtp.status) {
            return response_handler_1.default.sendErrorResponse({ res, code: 400, error: verifyOtp.message });
        }
        const token = await utils_1.default.generateToken({
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        });
        await user_service_1.default.atomicUpdate(user._id, {
            $set: {
                verified_email: true,
                verified_email_at: new Date(),
            },
        });
        const data = {
            token,
            ...user,
        };
        return response_handler_1.default.sendSuccessResponse({ res, code: 201, message: 'Email verified successfully', data });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.verifyEmail = verifyEmail;
const registerUser = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password, phone_number } = req.body;
    try {
        const existingUser = await user_service_1.default.getByEmail({ email: email.toLowerCase() });
        if (existingUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 409, error: `${email} is already taken` });
        }
        if (password !== confirm_password) {
            return response_handler_1.default.sendErrorResponse({ res, code: 400, error: 'Passwords mismatch' });
        }
        const user = await user_service_1.default.createUser({
            first_name: first_name.charAt(0).toUpperCase() + first_name.slice(1),
            last_name: last_name.charAt(0).toUpperCase() + last_name.slice(1),
            email: email.toLowerCase(),
            password,
            confirm_password,
            phone_number,
        });
        const user_id = new mongoose_1.Types.ObjectId(String(user._id));
        const otp = await utils_1.default.generateOtp({ user_id });
        await (0, mail_service_1.sendWelcomeEmail)({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to FurniZen',
        });
        return response_handler_1.default.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.registerUser = registerUser;
