import express from 'express';
import * as UserControllers from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', UserControllers.Register);

export default router;
