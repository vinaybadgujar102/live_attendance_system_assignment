import type { Request, Response } from "express";
import { ClassRepository } from "../repositories/class.repository";
import { ClassService } from "../services/class.service";
import { successResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";

const classService = new ClassService(new ClassRepository());

export const classController = {
  async createClass(req: Request, res: Response) {
    const { className } = req.body;
    const { userId: teacherId } = req.user!;

    const newClass = await classService.createClass({ className, teacherId });
    return successResponse(res, StatusCodes.CREATED, {
      _id: newClass._id,
      className: newClass.className,
      teacherId: newClass.teacherId,
      studentIds: newClass.studentIds,
    });
  },
};
