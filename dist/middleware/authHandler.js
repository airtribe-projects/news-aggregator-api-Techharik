import jwt from 'jsonwebtoken';
export function authHandler(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing or invalid',
            });
        }
        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            return;
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.data;
        next();
    }
    catch (err) {
        return res.status(401).json({
            sucess: false,
            message: 'Unauthorized or invalid token'
        });
    }
}
