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
        const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

        const getUser = await userService.getById({ _id: user._id });

        if (!getUser) {
            return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }

        const profile = await userService.getByQuery({ _id: user._id }, 'first_name last_name email  gender address');

        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: 'User Successfully fetched',
            data: profile,
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
