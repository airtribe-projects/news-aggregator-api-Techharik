import express from 'express';

const Router = express.Router();

import { authHandler } from '../middleware/authHandler.js';
import { getNewsPreferences } from '../controllers/newsConstrollers.js';


Router.get('/', authHandler, getNewsPreferences)

export default Router;