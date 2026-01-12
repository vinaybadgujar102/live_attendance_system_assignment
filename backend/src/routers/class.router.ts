import { Router } from "express";
import { validateRequestBody } from "../../validators";
import {
  addStudentToClassSchema,
  createClassSchema,
} from "../../validators/class.validator";
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

classRouter.post(
  "/:id/add-student",
  authMiddleware,
  isTeacher,
  validateRequestBody(addStudentToClassSchema),
  classController.addStudentToClass,
);

classRouter.get("/:id", authMiddleware, classController.getClassById);

export default classRouter;
