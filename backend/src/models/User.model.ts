import { Schema, model, Document } from "mongoose";

export enum UserRoles {
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
