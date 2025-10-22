import express from 'express';

const Router = express.Router();

import { userSignUp, userLogin } from '../controllers/userControllers.js';


Router.post('/signup', userSignUp)
Router.post('/login', userLogin)


export default Router;