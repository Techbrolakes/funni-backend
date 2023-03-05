"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const user_service_1 = __importDefault(require("../services/user.service"));
const Register = async (req, res) => {
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
            first_name,
            last_name,
            email: email.toLowerCase(),
            password,
            confirm_password,
            phone_number,
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
exports.Register = Register;
