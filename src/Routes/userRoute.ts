import express from 'express';

const Router = express.Router();

import { userSignUp, userLogin, userPreferences, updatePreferences } from '../controllers/userControllers.js';
import { authHandler } from '../middleware/authHandler.js';


Router.post('/signup', userSignUp)
Router.post('/login', userLogin)
Router.get('/preferences', authHandler, userPreferences)
Router.put('/preferences', authHandler, updatePreferences)

export default Router;