import express from 'express'
import 'dotenv/config';
const app = express();
import userRoutes from './Routes/userRoute.js'
import connectDB from './db/dbconfig.js';



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection db
app.get('/', (req, res) => {
    res.status(200).json({ 'message': 'Welcome to News API aggregator' })
})

//routes:
app.use('/v1/users', userRoutes)



export default app;