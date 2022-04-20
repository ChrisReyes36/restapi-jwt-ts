import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import configuration from "../configuration/configuration";
import User, { IUser } from "../models/User";

const SECRET_KEY: string | any = configuration.SECRET_KEY;

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            // Saving a new user to the database
            const { username, email, password } = req.body;

            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({
                    ok: false,
                    message: "User already exists",
                });
            }

            const newUser: IUser = new User({ username, email, password });
            newUser.password = await newUser.encryptPassword(password);

            await newUser.save();

            // Generating a token
            const token: string = jwt.sign({ _id: newUser._id }, SECRET_KEY, {
                expiresIn: "1h",
            });

            res.header("auth-token", token).status(201).json({
                ok: true,
                message: "User created successfully",
                user: newUser,
            });
        } catch (error: Error | any) {
            console.log(error);
            res.status(500).json({
                ok: false,
                error,
            });
        }
    },
    signin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: "User is not exists",
                });
            }

            const matchPassword: boolean = await user.matchPassword(password);

            if (!matchPassword) {
                return res.status(400).json({
                    ok: false,
                    message: "Incorrect password",
                });
            }

            // Generating a token
            const token: string = jwt.sign({ _id: user._id }, SECRET_KEY, {
                expiresIn: "1h",
            });

            res.header("auth-token", token).status(200).json({
                ok: true,
                message: "User signed in successfully",
                user,
            });
        } catch (error: Error | any) {
            console.log(error);
            res.status(500).json({
                ok: false,
                error,
            });
        }
    },
    profile: async (req: Request, res: Response) => {
        try {
            const user = await User.findById(req.userId, { password: 0 });

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: "User is not exists",
                });
            }

            res.status(200).json({
                ok: true,
                message: "User profile",
                user,
            });
        } catch (error: Error | any) {
            console.log(error);
            res.status(500).json({
                ok: false,
                error,
            });
        }
    },
};
