import User from "../modal/userModal.js";
import { Request, Response } from 'express';
import { loginVaildationTypes, userSchemaTypes } from "../types/user.types.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "zod";
import { createToken } from "../utils/jwt.js";




const userSignUp = asyncHandler(async (req: Request, res: Response) => {
    // Use safeParse for validation
    const result = userSchemaTypes.safeParse(req.body);

    if (!result.success) {
        return res.status(422).json({
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

    return res.status(201).json({
        success: true,
        message: 'User Created Successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        },
    });
});


const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = loginVaildationTypes.safeParse(req.body);

    if (!result.success) {
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: result.error,
        });
    };

    //parse the data:
    const { email, password } = req.body;

    // check the user is in the db
    const existedUser = await User.findOne({ email }).select('password');

    if (!existedUser) {
        return res.status(400).json({
            success: false,
            message: 'User Record Not Found'
        })
    };
    // Verfiy the password:
    const verifyPassword = await existedUser.verifyPassword(password, existedUser.password);

    if (!verifyPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password Mismatch Verification failed'
        })
    }

    // create a token and send the token as response:
    const token = createToken(existedUser);
    return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token
    })

});


export {
    userSignUp,
    userLogin
}