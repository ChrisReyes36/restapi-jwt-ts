import { Schema, model, Document } from "mongoose";
import bycript from "bcryptjs";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    encryptPassword(password: string): Promise<string>;
    matchPassword(password: string): Promise<boolean>;
}

const userChema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            minlength: [4, "Username must be at least 4 characters long"],
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userChema.methods.encryptPassword = async (
    password: string
): Promise<string> => {
    const salt = await bycript.genSalt(10);
    return await bycript.hash(password, salt);
};

userChema.methods.matchPassword = async function (
    password: string
): Promise<boolean> {
    return await bycript.compare(password, this.password);
};

export default model<IUser>("User", userChema);
