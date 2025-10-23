import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        minLenght: [3, 'Name must be Least 3 characters long'],
        maxLenght: [50, 'Name cannont exceet 50 characters'],
        trim: true,
    },
    email: {
        type: 'String',
        required: [true, "Email is required"],
        unique: [true, "Email is already registered"],
        lowercase: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    preferences: {
        type: [String],
        default: []
    }
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.verifyPassword = async function (candidatePassword, // plain password from login
userPassword // hashed password from DB (this.password)
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
const User = model('User', userSchema);
export default User;
