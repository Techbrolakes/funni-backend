import express from 'express';
import * as UserControllers from '../controllers/user.controller';
import * as UserValidations from '../validations/user.validation';

const router = express.Router();

router.post('/register', UserValidations.RegisterUser, UserControllers.Register);

export default router;
