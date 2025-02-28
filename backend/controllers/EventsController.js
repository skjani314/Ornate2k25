import EventModel from "../models/EventModel.js";
import RegisterModel from "../models/RegisterModel.js";
import TeamModel from "../models/TeamModel.js";
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import xlsx from 'xlsx';
import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';

const AddEvent = async (req, res, next) => {



    try {


        const { name, date, deadline, location, from_time, to_time, des, team_size } = req.body;
        console.log(req.body);
        const imageFile = req.file;
        console.log(imageFile)
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url
            const result = await EventModel.create({ name, date, deadline, location, from_time, to_time, des, team_size, img: imageUrl })
            res.json(result);

        }
        else {
            next(new Error('image not found'));
        }


    }
    catch (err) {
        next(err);
    }

}


const EventRegister = async (req, res, next) => {

    try {

        const { id } = req.params;
        const event_details = await EventModel.findById(id);

        if (event_details.team_size == "1") {


            const users = await RegisterModel.aggregate([
                {
                    $match: { event_id: new mongoose.Types.ObjectId(id) } // Match the specific event
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: '$userInfo'
                },
                {
                    $project: {
                        _id: 0,
                        name: '$userInfo.name',
                        email: '$userInfo.email',
                        mobile: '$userInfo.mobile',
                        branch: '$userInfo.branch',
                        collage_id: '$userInfo.collage_id'
                    }
                }
            ]);

            res.json({ event: event_details, members: users });

        }
        else {


            const teams = await TeamModel.aggregate([
                {
                    $match: { event_id: new mongoose.Types.ObjectId(id) } // Match the specific event
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'team_lead',
                        foreignField: '_id',
                        as: 'teamLeadInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'members',
                        foreignField: '_id',
                        as: 'membersInfo'
                    }
                },
                {
                    $unwind: '$teamLeadInfo' // Convert array into an object for team lead
                },
                {
                    $project: {
                        _id: 0,
                        team_name: 1,
                        team_code: 1,
                        team_lead: {
                            name: '$teamLeadInfo.name',
                            email: '$teamLeadInfo.email',
                            mobile: '$teamLeadInfo.mobile',
                            branch: '$teamLeadInfo.branch',
                            collage_id: '$teamLeadInfo.collage_id'
                        },
                        members: {
                            $map: {
                                input: '$membersInfo',
                                as: 'member',
                                in: {
                                    name: '$$member.name',
                                    email: '$$member.email',
                                    mobile: '$$member.mobile',
                                    branch: '$$member.branch',
                                    collage_id: '$$member.collage_id'
                                }
                            }
                        }
                    }
                }
            ]);

            res.json({ event: event_details, members: teams });



        }


    }
    catch (err) {
        console.log(err);
    }


}



const GetEvents = async (req, res, next) => {

    try {
        const event = req.query.event?.trim();


        console.log("Searching for event:", event);

        const regex = new RegExp(event, "i");

        const result = await EventModel.find({ name: { $regex: regex } });
        ;

        console.log("Query result:", result);
        res.json(result);


    }
    catch (err) {
        next(err);
    }


}

const DeleteEvent = async (req, res, next) => {


    try {

        const { id } = req.params;

        const result = EventModel.findById(id);

        await EventModel.findByIdAndDelete(id);
        if (result.team_size <= 1) {
            await RegisterModel.deleteMany({ event_id: id });
        } else {
            await TeamModel.deleteMany({ event_id: id });
        }

        res.json("deleted successfully");

    }
    catch (err) {
        next(err);
    }

}

const UpdateEvent = async (req, res, next) => {


    try {
        const { event_id, name, date, deadline, location, from_time, to_time, des, team_size } = req.body;
        const { id } = req.params;
        const imageFile = req.file;
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId);
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url
            const result = await EventModel.findByIdAndUpdate(objectId, { name, date, deadline, location, from_time, to_time, des, team_size, img: imageUrl }, { new: true });

            res.json(result);

        }
        else {
            console.log(name + " " + des)
            const result = await EventModel.findByIdAndUpdate(objectId, { name, date, deadline, location, from_time, to_time, des, team_size, }, { new: true });
            res.json(result);
        }

    }
    catch (err) {
        next(err);
    }

}


const Announce = async (req, res, next) => {

    try {

        const { event_id, subject, des } = req.body;

        const event = await EventModel.findById(event_id);



        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'skilllinkforget@gmail.com',
                pass: process.env.EMAILPASSWORD
            }
        });




        if (event.team_size == '1') {

            const soloRegistrations = await RegisterModel.find({ event_id: event_id })
                .populate("user_id", "email");

            const soloEmails = soloRegistrations.map(reg => reg.user_id.email);

            const mailOptions = {
                from: 'skilllinkforget@gmail.com',
                to: soloEmails.join(','),
                subject: subject,
                html: `<html>
        <body>
          <h1>Hello,</h1>
          <p>${des}</p><br/>
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

        }
        else {

            const teamRegistrations = await TeamModel.find({ event_id: event_id })
                .populate("team_lead", "email")
                .populate("members", "email");

            let teamEmails = [];
            teamRegistrations.forEach(team => {
                teamEmails.push(team.team_lead.email);
                team.members.forEach(member => teamEmails.push(member.email));
            });


            const mailOptions = {
                from: 'skilllinkforget@gmail.com',
                to: teamEmails.join(','),
                subject: subject,
                html: `<html>
        <body>
          <h1>Hello,</h1>
          <p>${des}</p><br/>
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

        }

        res.json("sent");

    }
    catch (err) {
        next(err);
    }

}


const BulkAddition = async (req, res, next) => {

    try {
        const workbook = xlsx.readFile(req.file.path, { cellDates: true });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const result = await Promise.all(
            data.map(async (each) => {
                try {
                    const { branch, collage_id, email, mobile, name } = each;
                    const password = collage_id.slice(0, 4) + mobile % 10000;
                    const hashpassword = await bcrypt.hash(password, 10);
                    const response = await UserModel.create({ name, email, password: hashpassword, mobile, collage_id, branch })
                    console.log(password);
                    return response;
                }
                catch (err) {
                    return next(err);
                }

            })
        )
        res.json(result);
    } catch (err) {
        next(err);
    }

}


export { AddEvent, GetEvents, DeleteEvent, UpdateEvent, Announce, EventRegister, BulkAddition }