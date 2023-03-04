import { User } from '../models';
import bcrypt from 'bcrypt';
import { IGetByEmail, IRegister, IUserDocument } from '../interfaces/user.interface';

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
}

export default new UserService();
