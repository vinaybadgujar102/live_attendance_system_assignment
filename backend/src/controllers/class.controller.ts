import type { Request, Response } from "express";
import { ClassRepository } from "../repositories/class.repository";
import { ClassService } from "../services/class.service";
import { errorResponse, successResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import { UserRepository } from "../repositories/user.repository";

const classService = new ClassService(
  new ClassRepository(),
  new UserRepository(),
);

export const classController = {
  async getClassById(req: Request, res: Response) {
    try {
      const { userId, role } = req.user!;
      const classId = req.params.id;
      const fetchedClass = await classService.getClassById(
        userId,
        role,
        classId,
      );

      return successResponse(res, StatusCodes.OK, {
        _id: fetchedClass._id,
        className: fetchedClass.className,
        students: fetchedClass.studentIds,
      });
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof NotFoundError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },

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

  async addStudentToClass(req: Request, res: Response) {
    const { studentId } = req.body;
    const teacherId = req.user?.userId!;
    const classId = req.params.id;
    try {
      const updatedClass = await classService.addStudentToClass(
        classId,
        teacherId,
        studentId,
      );

      return successResponse(res, StatusCodes.OK, {
        _id: updatedClass._id,
        className: updatedClass.className,
        teacherId: updatedClass.teacherId,
        studentIds: updatedClass.studentIds,
      });
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof NotFoundError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },
};
