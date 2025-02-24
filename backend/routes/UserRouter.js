import express from 'express';
import { SendOtp, UserLogin, UserRegister } from '../controllers/User/UserLogIn';

const UserRouter=express.Router();

UserRouter.post('/auth/login',UserLogin);
UserRouter.post('/auth/register',UserRegister);
UserRouter.post('/auth/send-otp',SendOtp);
UserRouter.post('/auth/forget/',);

export default UserRouter;