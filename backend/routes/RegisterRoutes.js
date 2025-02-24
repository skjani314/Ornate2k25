import express from 'express';
import { CreateTeam, DeleteTeam, JoinTeam, RemoveMember, SoloRegister, SoloUnregister } from '../controllers/RegisterControllers';

const RegisterRoutes = express.Router();


RegisterRoutes.post('/soloregister', SoloRegister);
RegisterRoutes.delete('/solounregister/:id', SoloUnregister);
RegisterRoutes.post('/team/join', JoinTeam);
RegisterRoutes.post('/team/create', CreateTeam);
RegisterRoutes.delete('/team/delete/:id', DeleteTeam);
RegisterRoutes.put('/team/remove_member/:id', RemoveMember);

export default RegisterRoutes;
