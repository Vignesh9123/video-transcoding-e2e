import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (id: string) => {
    return jwt.sign({ id }, config.JWT_SECRET, {expiresIn: config.JWT_EXPIRATION } as SignOptions);
}

export const verifyToken = (token: string) => jwt.verify(token, config.JWT_SECRET);
