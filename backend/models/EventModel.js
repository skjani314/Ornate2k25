import mongoose from 'mongoose';

const EvenetsSchema = new mongoose.Schema({

    name: { type: String, unique: true, required: true },
    date: { type: Date },
    deadLine: { type: Date },
    location: { type: String },
    from_time: { type: String },
    to_time: { type: String },
    des: { type: String },
    team_size: { type: String }
});

const EventModel = mongoose.model('events', EvenetsSchema);

export default EventModel;