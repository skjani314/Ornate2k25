
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';


const UserAuth = async (req, res, next) => {

    try {
        const token  =  req.headers.authorization.split(" ")[1];
       
        if (!token) {
            return next(new Error("User Not Found"));
        }
        else {


            const token_decode = await jwt.verify(token, process.env.KEY);
            const {id}=token_decode;
            req.id = id;
            const user = await UserModel.findById(token_decode.id);
            
            if (user != null) {
                next();
            }
            else {
                next(new Error("Unauthorized"));
            }
        }
    } catch (error) {
        next(error);
    }




}

export default UserAuth;