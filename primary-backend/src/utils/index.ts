import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (payload: any) => {
    return jwt.sign(payload, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRATION } as SignOptions);
}

export const verifyToken = (token: string) => jwt.verify(token, config.JWT_SECRET);
