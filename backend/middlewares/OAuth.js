
import jwt from 'jsonwebtoken';
import OrganizerModel from '../models/OrganizerModel.js';


const OAuth = async (req, res, next) => {

    try {
        const { token } = req.headers;


        if (!token) {
            return next(new Error("User Not Found"));
        }
        else {


            const token_decode = await jwt.verify(token, process.env.KEY);
            req.id = token_decode.id;
            const user = await OrganizerModel.findById(token_decode.id);
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

export default OAuth;