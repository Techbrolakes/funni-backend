"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.createUser = async (user) => {
            if (user.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                const hash = await bcrypt_1.default.hash(user.password, salt);
                user.password = hash;
            }
            const newUser = new models_1.User(user);
            return await newUser.save();
        };
        this.getByEmail = async ({ email, leanVersion = true }) => {
            return models_1.User.findOne({ email }).lean(leanVersion);
        };
    }
    async atomicUpdate(user_id, record, session = null) {
        return models_1.User.findOneAndUpdate({ _id: user_id }, { ...record }, { new: true, session });
    }
}
exports.default = new UserService();
