import type { UserRoles } from "../src/models/User.model";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthPayload = {
  userId: string;
  role: UserRoles;
};

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  return decoded;
};

export const generateToken = (obj: AuthPayload) => {
  return jwt.sign(obj, process.env.JWT_SECRET!, { expiresIn: "1h" });
};
