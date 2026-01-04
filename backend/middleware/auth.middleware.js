import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req, res, next) => {
    try {
        // Safely extract token
        const authHeader = req.headers.authorization;
        const token = req.cookies?.token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        // Check if token is blacklisted
        const isBlackListed = await redisClient.get(token);

        if (isBlackListed) {
            res.cookie('token', '');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        res.status(401).send({ error: 'Unauthorized User' });
    }
}