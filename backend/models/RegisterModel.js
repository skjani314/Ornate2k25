import mongoose from 'mongoose'

const RegisterSchema = new mongoose.Schema({


    user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'users', unique: true },
    event_id: { type: mongoose.Types.ObjectId, required: true, ref: 'events' }

})

const RegisterModel = mongoose.model('register', RegisterSchema);

export default RegisterModel;