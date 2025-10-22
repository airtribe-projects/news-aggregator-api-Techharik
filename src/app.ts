import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
const app = express();
import userRoutes from './Routes/userRoute.js'
import connectDB from './db/dbconfig.js';



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection db
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 'message': 'Welcome to News API aggregator' })
})

//routes:
app.use('/v1/users', userRoutes)


//Global Error Handlings:

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

export default app;