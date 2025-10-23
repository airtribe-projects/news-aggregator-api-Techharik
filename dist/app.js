import express from 'express';
import 'dotenv/config';
import userRoutes from './Routes/userRoute.js';
import newsRoutes from './Routes/newsRoute.js';
import connectDB from './db/dbconfig.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//connection db Note:' DB is added here just to make the test cases passes. '
connectDB();
app.get('/', (req, res) => {
    res.status(200).json({ 'message': 'Welcome to News API aggregator' });
});
//routes:
app.use('/users', userRoutes);
app.use('/news', newsRoutes);
//Global Error Handlings:
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});
export default app;
