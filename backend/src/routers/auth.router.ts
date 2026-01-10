import { Router } from "express";
import { loginSchema, signupSchema } from "../../validators/auth.validator";
import { validateRequestBody } from "../../validators";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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

authRouter.get("/me", authMiddleware, AuthController.getMe);

export default authRouter;
