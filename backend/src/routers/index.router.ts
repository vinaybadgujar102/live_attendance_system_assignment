import { Router } from "express";
import authRouter from "./auth.router";
import classRouter from "./class.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/class", classRouter);

export default router;
