import { Router } from "express";
import authRouter from "./auth.router";
import classRouter from "./class.router";
import studentRouter from "./student.router";
import attendanceRouter from "./attendance.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/class", classRouter);
router.use("/students", studentRouter);
router.use("/attendance", attendanceRouter);

export default router;
