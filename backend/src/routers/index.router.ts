import { Router } from "express";
import authRouter from "./auth.router";
import classRouter from "./class.router";
import studentRouter from "./student.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/class", classRouter);
router.use("/students", studentRouter);

export default router;
