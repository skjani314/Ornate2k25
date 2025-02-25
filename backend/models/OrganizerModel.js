import mongoose from "mongoose";


const OSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, required: true },
    collage_id: { type: String, required: true, unique: true },
    branch: { type: String },
    password: { type: String, required: true }

})

const OrganizerModel = mongoose.model('organizers', OSchema);

export default OrganizerModel;