import { User } from '../models';
import bcrypt from 'bcrypt';
import { IGetByEmail, IRegister, IUserDocument } from '../interfaces/user.interface';
import { Types } from 'mongoose';

class UserService {
    // Create a new user
    public createUser = async (user: IRegister): Promise<IUserDocument> => {
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);

            user.password = hash;
        }

        const newUser = new User(user);
        return await newUser.save();
    };

    // Find a user by email
    public getByEmail = async ({ email, leanVersion = true }: IGetByEmail): Promise<IUserDocument> => {
        return User.findOne({ email }).lean(leanVersion);
    };

    // Find a user by id and update
    public async atomicUpdate(user_id: Types.ObjectId, record: any, session: any = null) {
        return User.findOneAndUpdate({ _id: user_id }, { ...record }, { new: true, session });
    }
}

export default new UserService();
