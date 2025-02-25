import EventModel from "../models/EventModel.js";
import RegisterModel from "../models/RegisterModel.js";
import TeamModel from "../models/TeamModel.js";
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';


const AddEvent = async (req, res, next) => {



    try {


        const { name, date, deadline, location, from_time, to_time, des, team_size } = req.body;
        console.log(req.body);
        const imageFile = req.file;
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



const GetEvents = async (req, res, next) => {

    try {

        const result = await EventModel.find();

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


export { AddEvent, GetEvents, DeleteEvent, UpdateEvent, Announce }