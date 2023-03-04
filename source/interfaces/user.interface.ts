import { Document } from 'mongoose';

export enum IGenderType {
    MALE = 'male',
    FEMALE = 'female',
    OTHERS = 'others',
}

export interface IUser {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
}

export interface IUserDocument extends IUser, Document {}
