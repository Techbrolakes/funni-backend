import { Document } from 'mongoose';

export interface IUser {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
}

export interface IUserDocument extends IUser, Document {}
