import express from 'express';
import { ForgetPassword, ForgetVerify, passChange, SendOtp, UserLogin, UserRegister } from '../controllers/User/UserLogIn.js';

const UserRouter = express.Router();

UserRouter.post('/auth/login', UserLogin);
UserRouter.post('/auth/register', UserRegister);
UserRouter.post('/auth/send-otp', SendOtp);
UserRouter.post('/auth/forget/', ForgetPassword);
UserRouter.post('/auth/verify', ForgetVerify);
UserRouter.post('/auth/passchange', passChange);

export default UserRouter;