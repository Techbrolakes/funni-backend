import { model } from 'mongoose';

// OTP
import { OtpSchema } from './otp.model';
import { IOtpDocument } from '../interfaces/otp.interface';

export const Otp = model<IOtpDocument>('Otps', OtpSchema);
