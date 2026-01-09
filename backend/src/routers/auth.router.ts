import { Router } from "express";
import { signupSchema } from "../../validators/auth.validator";
import { validateRequestBody } from "../../validators";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateRequestBody(signupSchema),
  AuthController.signup,
);

export default authRouter;
