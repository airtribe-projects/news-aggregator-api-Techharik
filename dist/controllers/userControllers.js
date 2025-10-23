import User from "../modal/userModal.js";
import { loginVaildationTypes, userSchemaTypes } from "../types/user.types.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/jwt.js";
const userSignUp = asyncHandler(async (req, res) => {
    // Use safeParse for validation
    const result = userSchemaTypes.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: result.error,
        });
    }
    const { name, email, password, preferences } = result.data;
    // Create the user in DB 
    //Password are hashed the method is written in the modal pre methods.
    const newUser = await User.create({
        name,
        email,
        password,
        preferences,
    });
    // note: satus code is 201 but in test it written as 200
    return res.status(200).json({
        success: true,
        message: 'User Created Successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            preferences: newUser.preferences
        },
    });
});
const userLogin = asyncHandler(async (req, res) => {
    const result = loginVaildationTypes.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: result.error,
        });
    }
    ;
    //parse the data:
    const { email, password } = req.body;
    // check the user is in the db
    const existedUser = await User.findOne({ email }).select('password');
    if (!existedUser) {
        return res.status(400).json({
            success: false,
            message: 'User Record Not Found'
        });
    }
    ;
    // Verfiy the password:
    const verifyPassword = await existedUser.verifyPassword(password, existedUser.password);
    if (!verifyPassword) {
        return res.status(401).json({
            success: false,
            message: 'Password Mismatch Verification failed'
        });
    }
    // create a token and send the token as response:
    const token = createToken(existedUser);
    return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token
    });
});
const userPreferences = asyncHandler(async (req, res) => {
    const user_id = req.userId;
    if (!user_id) {
        return res.status(401).json({ success: false, message: 'Give user id not found' });
    }
    const user = await User.findOne({ _id: user_id });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User is not found in the record'
        });
    }
    return res.status(200).json({
        preferences: user.preferences
    });
});
const updatePreferences = async (req, res) => {
    const { preferences } = req.body; // expects: { preferences: ["movies", "games"] }
    if (!Array.isArray(preferences)) {
        return res.status(400).json({
            success: false,
            message: 'Preferences must be an array of strings',
        });
    }
    const userId = req.userId; // set by auth middleware
    const updatedUser = await User.findByIdAndUpdate(userId, { preferences }, { new: true, runValidators: true }).select('-password');
    return res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        user: updatedUser,
    });
};
export { userSignUp, userLogin, userPreferences, updatePreferences, };
