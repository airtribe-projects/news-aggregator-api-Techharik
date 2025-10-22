import { userType } from "../types/user.types.js";
import jwt, { SignOptions } from 'jsonwebtoken';

import { IUser } from "../modal/userModal.js";

const JWT_SECRET: (string | undefined) = process.env.JWT_SECRET;
// const expiresIn: (string) = process.env.JWT_EXPIRES_TIME || '7h'
export const createToken = (user: IUser): (string | undefined) => {
    if (!JWT_SECRET) return undefined;


    const token = jwt.sign({
        data: user._id
    }, JWT_SECRET, { expiresIn: "7h" });
    return token;
}