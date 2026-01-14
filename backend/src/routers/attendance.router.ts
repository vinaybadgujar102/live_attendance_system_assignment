import { Router } from "express";
import { authMiddleware, isTeacher } from "../middlewares/auth.middleware";
import { attendanceController } from "../controllers/attendance.controller";
import { validateRequestBody } from "../../validators";
import { startAttendanceSchema } from "../../validators/attendance.validator";

const attendanceRouter = Router();

attendanceRouter.use(
  "/start",
  authMiddleware,
  isTeacher,
  validateRequestBody(startAttendanceSchema),
  attendanceController.startAttendance,
);

export default attendanceRouter;
