import Otp from "../models/Otp.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import RegisterModel from "../models/RegisterModel.js";
import UserModel from "../models/UserModel.js"
import OrganizerModel from "../models/OrganizerModel.js";
import TeamModel from "../models/TeamModel.js";
import mongoose from "mongoose";
import cloudinary from 'cloudinary';




const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email)

        const user = await UserModel.findOne({ email });

        if (!user) {
            next(new Error("User Not Found"));
            return;
        }
        {

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const accessToken = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '7d' });


                return res.status(200).json(accessToken);
            } else {
                return res.status(401).json({ message: "Password incorrect" });
            }
        }
    } catch (error) {
        next(error);
    }
}


const OLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email)

        const user = await OrganizerModel.findOne({ email });

        if (!user) {
            next(new Error("User Not Found"));
        } {

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const accessToken = jwt.sign({ id: user._id, role: 'organizer' }, process.env.KEY, { expiresIn: '7d' });


                return res.status(200).json(accessToken);
            } else {
                return res.status(401).json({ message: "Password incorrect" });
            }
        }
    } catch (error) {
        next(error);
    }
}

const SendOtp = async (req, res, next) => {

    const { email } = req.body;

    try {

        const user = await UserModel.findOne({ email });
        if (user) {
            next(new Error('user already found'));
        } else {
            const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

            const otp = generateOtp();

            const hashedOtp = await bcrypt.hash(otp, 10);

            const oldRecord = await Otp.findOne({ email });
            if (!oldRecord) {
                const newOtp = await Otp.create({ email, otp: hashedOtp });
            } else {
                await Otp.deleteOne({ email });
                const newOtp = await Otp.create({ email, otp: hashedOtp });
            }



            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'skilllinkforget@gmail.com',
                    pass: process.env.EMAILPASSWORD
                }
            });

            const mailOptions = {
                from: 'skilllinkforget@gmail.com',
                to: email,
                subject: 'OTP Verification',
                html: `<html>
                    <body>
                      <h1>Hello,</h1>
                      <p>Your OTP code is: <strong>${otp}</strong></p>
                      <p>Thank you!</p>
                    </body>
                  </html>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            res.status(200).json('email sent')

        }
    } catch (error) {
        next(error);
    }
}

const ForgetPassword = async (req, res, next) => {

    try {

        const { email } = req.body;
        console.log(email);
        let user = await OrganizerModel.findOne({ email });

        if (!user) {
            user = await UserModel.findOne({ email });

        }

        if (!user) {
            next(new Error("User Not Found"));
        } else {


            const token = jwt.sign({ email }, process.env.KEY, { expiresIn: '5m' });



            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'skilllinkforget@gmail.com',
                    pass: process.env.EMAILPASSWORD
                }
            });

            const mailOptions = {
                from: 'skilllinkforget@gmail.com',
                to: email,
                subject: 'Forget Password',
                html: `<html>
                    <body>
                      <h1>Hello,</h1>
                      <p>Your Reset link is:<br></br> <strong>${process.env.FRONTENDURL + '/forgot/' + token}</strong></p>
                      <p>Thank you!</p>
                    </body>
                  </html>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.json(token);

        }
    } catch (err) {

        next(err);

    }


}

const ForgetVerify = async (req, res, next) => {


    try {

        const token = req.body.token;
        await jwt.verify(token, process.env.KEY, (err, decode) => {

            if (err) {
                next(err);
            } else {
                res.json({ verified: true });

            }

        })
    } catch (err) {

        next(err);

    }

}

const passChange = async (req, res, next) => {

    const { token } = req.body;
    const pass = req.body.data.password;

    try {

        await jwt.verify(token, process.env.KEY, async (err, decode) => {

            if (err) {
                next(err)
            } else {

                const email = decode.email;
                const hashpassword = await bcrypt.hash(pass, 10);
                console.log(hashpassword)
                const result = await UserModel.findOneAndUpdate({ email }, { password: hashpassword }, { new: true, runValidators: true });
                if (!result) {
                    const result = await OrganizerModel.findOneAndUpdate({ email }, { password: hashpassword }, { new: true, runValidators: true });

                }
                res.status(200).json("Password changed");

            }


        })
    } catch (err) {
        next(err);
    }

}

const UserRegister = async (req, res, next) => {
    try {
        const { name, email, password, mobile, branch, otp } = req.body;
        const collage_id = email.split('@')[0];
        const user = await UserModel.findOne({ email });

        if (user) {
            next(new Error("user Already Found"));
        } else {



            const otpRecord = await Otp.findOne({ email });
            if (!otpRecord) {
                next(new Error('invalid Otp'));
            } else {

                const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
                if (!isOtpValid) {
                    next(new Error('invalid OTP'));
                } else {

                    await Otp.deleteOne({ email });

                    console.log(email.split('@')[0]);
                    if (email.split('@')[1] == 'rguktong.ac.in') {
                        const hashpassword = await bcrypt.hash(password, 10);
                        const result = await UserModel.create({ name, email, password: hashpassword, mobile, collage_id, branch })
                        res.json("user created succesfully");

                    }
                    else {
                        next(new Error("Email not belongs to univeristy"));
                    }
                }

            }
        }

    } catch (error) {
        next(error);
    }

}

const Profile = async (req, res, next) => {


    try {
        const token = req.headers.authorization.split(" ")[1];


        if (!token) {
            return next(new Error("User Not Found"));
        }
        else {


            const token_decode = await jwt.verify(token, process.env.KEY);
            const { id, role } = token_decode;

            if (role == null) {
                const user = await UserModel.findById(id).select("-password");
                res.json(user);
            } else if (role == 'organizer') {
                const user = await OrganizerModel.findById(id).select("-password");
                res.json({ ...user, role: "organizer" });
            }
            else {
                next(new Error("invalid Authorization token"))
            }

        }
    } catch (error) {
        next(error);
    }


}

const OProfile = async (req, res, next) => {

    try {

        const { id } = req.id;
        console.log(id);
        const result = await OrganizerModel.findById(id).select('-password');
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}

const MyEvents = async (req, res, next) => {
    try {
        const id = req.id;



        const result_solo = await RegisterModel.find({ user_id: id }).populate("event_id")


        const teams = await TeamModel.find({
            $or: [{ team_lead: id }, { members: id }]
        })
            .populate("event_id")
            .populate("team_lead", "name email")
            .populate("members", "name email");
        console.log(teams);

        const solo_eve = (result_solo || []).map((each) => each?.event_id?._id).filter(Boolean);
        const team_eve = (teams || []).map((each) => each?.event_id?._id).filter(Boolean);

        res.json({ solo: result_solo, team: teams, my_events: [...solo_eve, ...team_eve] });

    } catch (err) {
        next(err);
    }
};

const updateProfile=async(req,res,next)=>{
    try{
        const user_id=req.id;
        console.log(user_id)
        const objectId = new mongoose.Types.ObjectId(user_id)
        console.log(objectId)
        const {name,mobile,branch}=req.body;
        const imageFile=req.file;
        console.log(imageFile)
        
        
        if (imageFile) {
            console.log('hii')
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url
            const result = await UserModel.findByIdAndUpdate(objectId, { name, mobile,branch,img: imageUrl }, { new: true });
            console.log(result)
            res.json(result);    
        
        }
        else {
            const result = await UserModel.findByIdAndUpdate(objectId, { name, mobile,branch}, { new: true });
            console.log(result)
            res.json(result); 
        }
    }
    catch(error){

    }
}



export { UserLogin, UserRegister, SendOtp, passChange, OProfile, OLogin, ForgetPassword, ForgetVerify, Profile, MyEvents,updateProfile };
