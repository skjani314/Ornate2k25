import express from 'express';
import { AddEvent, Announce, DeleteEvent, GetEvents, UpdateEvent, EventRegister, BulkAddition } from '../controllers/EventsController.js';
import upload from '../middlewares/multer.js';
import OAuth from '../middlewares/OAuth.js';

const EventRouter = express.Router();

EventRouter.post('/add', OAuth, AddEvent);
EventRouter.get('/', GetEvents);
EventRouter.delete('/remove/:id', OAuth, DeleteEvent);
EventRouter.put('/update/:id', OAuth, UpdateEvent);
EventRouter.post('/announce', OAuth, Announce);
EventRouter.get('/registration/:id', OAuth, EventRegister);
EventRouter.post('/bulk', BulkAddition);

export default EventRouter;