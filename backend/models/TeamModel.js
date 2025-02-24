import mongoose from 'mongoose';
import crypto from "crypto";

const TeamSchema = new mongoose.Schema({

    team_name: { type: String, unique: true, required: true },
    team_lead: { type: mongoose.Types.ObjectId, required: true, ref: 'users', unique: true },
    event_id: { type: mongoose.Types.ObjectId, required: true, ref: 'events' },
    members: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    team_code: { type: String, required: true, unique: true }

});

TeamSchema.pre("save", function (next) {
    if (!this.team_code) {
        const hash = crypto.createHash("sha256").update(this._id.toString()).digest("hex");
        this.team_code = hash.substring(0, 8).toUpperCase(); // Take first 8 chars
    }
    next();
});

const TeamModel = mongoose.model('teams', TeamSchema);

export default TeamModel;