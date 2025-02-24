import EventModel from "../models/EventModel.js";
import RegisterModel from "../models/RegisterModel.js";
import TeamModel from "../models/TeamModel.js";




const AddEvent = async (req, res, next) => {



    try {


        const { name, date, deadline, location, from_time, to_time, des, team_size } = req.body;


        const result = await EventModel.create({ name, date, deadline, location, from_time, to_time, des, team_size })

        res.json(result);

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
        const { id } = req.params;
        const { name, date, deadline, location, from_time, to_time, des, team_size } = req.body;

        const result = await EventModel.findByIdAndUpdate(id, { name, date, deadline, location, from_time, to_time, des, team_size }, { new: true });

        res.json(result);

    }
    catch (err) {
        next(err);
    }

}



export { AddEvent, GetEvents, DeleteEvent, UpdateEvent }