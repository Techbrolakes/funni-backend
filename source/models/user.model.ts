import { Schema } from 'mongoose';
import { IGenderType } from '../interfaces/user.interface';

export const UserSchema: Schema = new Schema(
    {
        first_name: { type: String },
        last_name: { type: String },
        email: { type: String, required: true, index: true, unique: true, lowercase: true },
        password: { type: String },
        phone: { type: String },
        address: { type: String },
        gender: { type: String, enum: Object.values(IGenderType) },
    },
    { timestamps: true },
);
