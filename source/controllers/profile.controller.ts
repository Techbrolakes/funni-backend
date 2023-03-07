import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import UtilsFunc from '../utils';
import userService from '../services/user.service';
import { User } from '../models';

/******
 *
 *
 * Get ALL User Details
 */
export const getAllUsers = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    try {
        const token: any = req.header('x-auth-token') || req.header('Authorization');
        const verify_token: any = await UtilsFunc.verifyToken(token);

        const getUser = await userService.getById({ _id: verify_token._id });
        if (!getUser) {
            return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User not found' });
        }

        const profile = await userService.getByQuery(
            { _id: verify_token._id },
            'first_name last_name email phone_number gender address',
        );

        return ResponseHandler.sendSuccessResponse({ res, code: 200, data: profile });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
