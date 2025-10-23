import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
// const expiresIn: (string) = process.env.JWT_EXPIRES_TIME || '7h'
export const createToken = (user) => {
    if (!JWT_SECRET)
        return undefined;
    const token = jwt.sign({
        data: user._id
    }, JWT_SECRET, { expiresIn: "7h" });
    return token;
};
