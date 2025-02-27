import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import UserRouter from './routes/UserRouter.js';
import EventRouter from './routes/EventRouter.js';
import RegisterRoutes from './routes/RegisterRoutes.js';
import upload from './middlewares/multer.js';

const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();
app.use(express.json());
app.use(cors()); 
app.use(upload.single('img'));
app.use('/user', UserRouter);
app.use('/events', EventRouter);
app.use('/register', RegisterRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: true, message: err.message });
});

app.listen(port, () => console.log("Server Started", port))