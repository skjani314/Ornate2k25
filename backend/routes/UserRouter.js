import express from 'express';
import { ForgetPassword, ForgetVerify, passChange, SendOtp, UserLogin, UserRegister } from '../controllers/User/UserLogIn.js';
import { MyEvents, Profile } from '../controllers/UserLogIn.js';

const UserRouter = express.Router();

UserRouter.post('/auth/login', UserLogin);
UserRouter.post('/auth/register', UserRegister);
UserRouter.post('/auth/send-otp', SendOtp);
UserRouter.post('/auth/forget/', ForgetPassword);
UserRouter.post('/auth/verify', ForgetVerify);
UserRouter.post('/auth/passchange', passChange);
UserRouter.get('/user/profile', Profile)
UserRouter.get('/user/myevents', MyEvents);

export default UserRouter;