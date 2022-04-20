import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import configuration from "../configuration/configuration";

const SECRET_KEY: string | any = configuration.SECRET_KEY;

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

export const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: "Token is not provided",
        });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY) as IPayload;

        req.userId = payload._id;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "Token is invalid",
        });
    }
};
