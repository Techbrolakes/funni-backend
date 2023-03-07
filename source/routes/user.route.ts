import express from 'express';
import * as UserControllers from '../controllers/user.controller';
import * as UserValidations from '../validations/user.validation';
import * as UserProfile from '../controllers/profile.controller';

const router = express.Router();

router.post('/register', UserValidations.registerUser, UserControllers.registerUser);
router.post('/verify-email', UserValidations.VerifyEmail, UserControllers.verifyEmail);
router.post('/resend', UserValidations.resendVerification, UserControllers.resendVerification);
router.post('/login', UserValidations.loginUser, UserControllers.loginUser);
router.post('/recover', UserValidations.recoverPassword, UserControllers.recoverPassword);
router.post('/verify-otp', UserValidations.verifyOTP, UserControllers.verifyOTP);
router.post('/reset-password', UserValidations.resetPassword, UserControllers.resetPassword);
router.get('/get', UserProfile.getAllUsers);

export default router;
