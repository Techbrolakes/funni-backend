"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const utils_1 = __importDefault(require("../utils"));
const user_service_1 = __importDefault(require("../services/user.service"));
const models_1 = require("../models");
const getAllUsers = async (req, res) => {
    try {
        const token = req.header('x-auth-token') || req.header('Authorization');
        if (!token) {
            return response_handler_1.default.sendErrorResponse({ res, code: 401, error: 'Access denied. No token provided.' });
        }
        const verifyToken = await utils_1.default.verifyToken(token);
        const user = await user_service_1.default.getByEmail({ email: verifyToken.email });
        if (!user) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User not found' });
        }
        const data = await models_1.User.findOne({ email: verifyToken.email });
        return response_handler_1.default.sendSuccessResponse({ res, code: 200, data });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.getAllUsers = getAllUsers;
