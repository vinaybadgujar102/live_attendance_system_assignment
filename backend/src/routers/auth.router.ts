import { Router } from "express";
import bcrypt from "bcrypt";
import z from "zod";
import { signupSchema } from "../../validators/auth.validator";
import { User } from "../models/User.model";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const data = req.body;
  const parsedData = z.safeParse(signupSchema, data);
  console.log(parsedData.success);
  if (parsedData.error) {
    res.status(400).json({
      success: false,
      error: "Invalid request schema",
    });
    return;
  }

  const { email, password, role, name } = parsedData.data;

  const userPresent = await User.findOne({ email });
  if (userPresent) {
    res.status(400).json({
      success: false,
      error: "Email already exists",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: passwordHash,
    role,
    name,
  });
  if (!newUser) return;
  newUser.save();
  res.status(201).json({
    success: true,
    data: {
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

export default authRouter;
