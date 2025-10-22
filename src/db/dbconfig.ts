import mongoose from "mongoose";

const dbUrl: (string | undefined) = process.env.DB_URI;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        // 1 = connected
        console.log('MongoDB already connected');
        return;
    };
    console.log(mongoose.connection.readyState);

    try {
        if (dbUrl) return;
        await mongoose.connect(dbUrl);

        console.log('MongoDB connected successfully!');
    } catch (e) {
        console.log('MongoDB connection error:', e);
        process.exit(1)
    }
}

export default connectDB;