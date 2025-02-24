import RegisterModel from "../models/RegisterModel.js";
import TeamModel from "../models/TeamModel.js";




const SoloRegister = async (req, res, next) => {



    try {

        const { user_id, event_id } = req.body;

        const result = await RegisterModel.create(user_id, event_id);

        res.json(result);

    }
    catch (err) {
        next(err);
    }


}

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

        const { team_name, team_lead, event_id } = req.body;

        const result = await TeamModel.create({ team_name, team_lead, event_id, members: [] });


        res.json(result);

    }
    catch (err) {
        next(err);
    }

}


const JoinTeam = async (req, res, next) => {

    try {

        const { user_id, team_code, id } = req.body;

        const team = await TeamModel.findById(id);
        if (team_code == team.team_code) {
            const result = await TeamModel.findByIdAndUpdate(id, { $addToSet: { members: user_id } }, { new: true });
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