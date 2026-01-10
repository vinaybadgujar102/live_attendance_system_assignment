import { Router } from "express";
import { loginSchema, signupSchema } from "../../validators/auth.validator";
import { validateRequestBody } from "../../validators";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateRequestBody(signupSchema),
  AuthController.signup,
);

authRouter.post(
  "/login",
  validateRequestBody(loginSchema),
  AuthController.login,
);

export default authRouter;
