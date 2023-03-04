import { Document } from 'mongoose';

export interface IRegister {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone_number: string;
}

export interface IGetByEmail {
    email: string;
    leanVersion?: boolean;
}

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
    password?: string;
    phone?: string;
    address?: string;
    gender?: IGenderType;
}

export interface IUserDocument extends IUser, Document {}
