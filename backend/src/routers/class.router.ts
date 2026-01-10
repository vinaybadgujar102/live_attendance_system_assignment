import { Router } from "express";
import { validateRequestBody } from "../../validators";
import { createClassSchema } from "../../validators/class.validator";
import { authMiddleware, isTeacher } from "../middlewares/auth.middleware";
import { classController } from "../controllers/class.controller";

const classRouter = Router();

classRouter.post(
  "/",
  authMiddleware,
  isTeacher,
  validateRequestBody(createClassSchema),
  classController.createClass,
);

export default classRouter;
