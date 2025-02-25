import express from 'express';
import { AddEvent, Announce, DeleteEvent, GetEvents, UpdateEvent } from '../controllers/EventsController.js';
import upload from '../middlewares/multer.js';

const EventRouter = express.Router();

EventRouter.post('/add', AddEvent);
EventRouter.get('/', GetEvents);
EventRouter.delete('/remove/:id', DeleteEvent);
EventRouter.put('/update/:id', UpdateEvent);
EventRouter.post('/announce', Announce);

export default EventRouter;