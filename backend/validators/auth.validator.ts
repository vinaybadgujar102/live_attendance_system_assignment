import { z } from "zod";
import { UserRoles } from "../src/models/User.model";

export const signupSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.email(),
  password: z.string().min(6, "Pass must be of min 6 characters"),
  role: z.enum(UserRoles),
});
