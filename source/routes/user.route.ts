import express from 'express';
import * as UserControllers from '../controllers/user.controller';
import * as UserValidations from '../validations/user.validation';

const router = express.Router();

router.post('/register', UserValidations.RegisterUser, UserControllers.Register);
router.post('/verify-email', UserValidations.VerifyEmail, UserControllers.verifyEmail);
router.post('/resend', UserValidations.resendVerification, UserControllers.resendVerification);

export default router;
