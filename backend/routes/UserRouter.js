import express from 'express';
import { ForgetPassword, ForgetVerify, OLogin, OProfile, passChange, SendOtp, UserLogin, UserRegister } from '../controllers/UserLogIn.js';
import { MyEvents, Profile } from '../controllers/UserLogIn.js';
import UserAuth from '../middlewares/UserAuth.js';
import OAuth from '../middlewares/OAuth.js';

const UserRouter = express.Router();

UserRouter.post('/auth/login',UserLogin);
UserRouter.post('/auth/ologin', OLogin);
UserRouter.post('/auth/register', UserRegister);
UserRouter.post('/auth/send-otp', SendOtp);
UserRouter.post('/auth/forget/', ForgetPassword);
UserRouter.post('/auth/verify', ForgetVerify);
UserRouter.post('/auth/passchange', passChange);
UserRouter.get('/profile', UserAuth, Profile);
UserRouter.get('/oprofile', OAuth, OProfile);
UserRouter.get('/myevents',UserAuth,MyEvents);


export default UserRouter;