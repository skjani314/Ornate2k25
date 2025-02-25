import RegisterModel from "../models/RegisterModel.js";
import TeamModel from "../models/TeamModel.js";
import mongoose from "mongoose";

const SoloRegister = async (req, res, next) => {
    try {
        const { id } = req;
        const { event_id } = req.body;


        if (!id || !event_id) {
            return res.status(400).json({ error: "user_id and event_id are required" });
        }


        const result = await RegisterModel.create({
            user_id: new mongoose.Types.ObjectId(id),
            event_id: new mongoose.Types.ObjectId(event_id),
        });

        res.status(201).json(result);

    } catch (err) {
        next(err);
    }
};

const SoloUnregister = async (req, res, next) => {

    try {

        const { id } = req.params;
        const result = await RegisterModel.deleteOne({ user_id: id });

        res.json(result);

    }
    catch (err) {
        next(err);
    }
}




const CreateTeam = async (req, res, next) => {
    try {
        const { team_name, event_id } = req.body;
        const { id } = req;
        console.log(team_name, event_id, id)
        if (!team_name || !id || !event_id) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const newTeam = new TeamModel({
            team_name,
            team_lead: new mongoose.Types.ObjectId(id),
            event_id: new mongoose.Types.ObjectId(event_id),
            members: [],

        });

        const result = await newTeam.save();
        res.json({ team_code: result.team_code })


    } catch (err) {

        next(err);
    }
};



const JoinTeam = async (req, res, next) => {

    try {

        const { user_id, team_code, event_id } = req.body;
        const eventObj = new mongoose.Types.ObjectId(event_id);
        const team = await TeamModel.findOne({ team_code: team_code, event_id: eventObj });
        if (team != null) {
            const result = await TeamModel.findByIdAndUpdate(team._id, { $addToSet: { members: user_id } }, { new: true });
            res.json(result);
        }
        else {
            next(new Error("No Team Found"));
        }

    }
    catch (err) {

        next(err);
    }


}

const DeleteTeam = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await TeamModel.findByIdAndDelete(id);

        res.json(result);

    }
    catch (err) {

        next(err);
    }


}

const RemoveMember = async (req, res, next) => {

    try {

        const { user_id } = req.body;
        const { id } = req.params;


        const result = await TeamModel.findByIdAndUpdate(
            id,
            { $pull: { members: user_id } },
            { new: true, runValidators: true })

        res.json(result);
    }
    catch (err) {
        next(err);
    }

}


export { SoloRegister, SoloUnregister, CreateTeam, JoinTeam, DeleteTeam, RemoveMember }