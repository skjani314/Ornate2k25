import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, required: true },
    collage_id: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    password: { type: String, required: true }

})

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;