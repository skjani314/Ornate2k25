import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    img: { type: String, default: "https://res.cloudinary.com/dsad92ak9/image/upload/cjxhkplev75abm5zha9c"},
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, required: true },
    collage_id: { type: String, required: true, unique: true },
    branch: { type: String },
    password: { type: String, required: true }

})

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;