import Otp from "../models/Otp.js";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import RegisterModel from "../models/RegisterModel.js";
import UserModel from "../models/UserModel.js"
import OrganizerModel from "../models/OrganizerModel.js";

const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email)

        const user = await UserModel.findOne({ email });

        if (!user) {
            next(new Error("User Not Found"));
        } {

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
        const user = await UserModel.findOne({ email });

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
    const pass = req.body.password;

    try {

        await jwt.verify(token, process.env.KEY, async (err, decode) => {

            if (err) {
                next(err)
            } else {

                const email = decode.email;
                const hashpassword = await bcrypt.hash(pass, 10);
                console.log(hashpassword)
                const result = await UserModel.findOneAndUpdate({ email }, { password: hashpassword }, { new: true, runValidators: true });
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

        const { id } = req.id;
        const { role } = req.body;
        const result = await UserModel.findById(id).select('-password');

        res.json(result);


    }
    catch (err) {
        next(err);
    }
}

const OProfile = async (req, res, next) => {

    try {

        const { id } = req.id;
        const result = await OrganizerModel.findById(id).select('-password');
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}


const MyEvents = async (req, res, next) => {

    try {

        const { user_id } = req.id;

        const result_solo = await RegisterModel.find({ user_id });
        const teams = await TeamModel.find({
            $or: [{ team_lead: user_Id }, { members: userId }]
        })
            .populate("event_id")
            .populate("team_lead", "name email")
            .populate("members", "name email");

        res.json({ teams, result_solo });



    }
    catch (err) {
        next(err);
    }
}


export { UserLogin, UserRegister, SendOtp, passChange, OProfile, OLogin, ForgetPassword, ForgetVerify, Profile, MyEvents };