import { Router } from "express";
import { authMiddleware, isTeacher } from "../middlewares/auth.middleware";
import { studentController } from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.get(
  "/",
  authMiddleware,
  isTeacher,
  studentController.getAllStudents,
);

export default studentRouter;
