import { Response } from 'express';
import { ExpressRequest } from '../server';
import { IRegister } from '../interfaces/user.interface';
import ResponseHandler from '../utils/response-handler';
import userService from '../services/user.service';

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
            first_name,
            last_name,
            email: email.toLowerCase(),
            password,
            confirm_password,
            phone_number,
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
