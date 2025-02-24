import express from 'express';
import { CreateTeam, DeleteTeam, JoinTeam, RemoveMember, SoloRegister, SoloUnregister } from '../controllers/RegisterControllers.js';
import UserAuth from '../middlewares/UserAuth.js';

const RegisterRoutes = express.Router();


RegisterRoutes.post('/soloregister',UserAuth,SoloRegister);
RegisterRoutes.delete('/solounregister/:id', SoloUnregister);
RegisterRoutes.post('/team/join', JoinTeam);
RegisterRoutes.post('/team/create',UserAuth,CreateTeam);
RegisterRoutes.delete('/team/delete/:id', DeleteTeam);
RegisterRoutes.put('/team/remove_member/:id', RemoveMember);

export default RegisterRoutes;
