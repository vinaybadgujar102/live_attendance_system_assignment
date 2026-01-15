import type { Request, Response } from "express";
import { ClassRepository } from "../repositories/class.repository";
import { ClassService } from "../services/class.service";
import { errorResponse, successResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError, NotFoundError } from "../../utils/app.error";
import { UserRepository } from "../repositories/user.repository";
import { Attendance } from "../models/Attendance.model";
import { Class } from "../models/Class.model";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceRepository } from "../repositories/attendance.repository";

const classService = new ClassService(
  new ClassRepository(),
  new UserRepository(),
);
const attendanceService = new AttendanceService(
  new ClassRepository(),
  new AttendanceRepository(),
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

  async getMyAttendance(req: Request, res: Response) {
    const classId = req.params.id;
    const { userId } = req.user!;
    try {
      const getAttendance = await attendanceService.getMyAttendance(
        classId,
        userId,
      );

      if (!getAttendance) {
        return successResponse(res, StatusCodes.OK, {
          classId,
          status: null,
        });
      }
      return successResponse(res, StatusCodes.OK, {
        classId,
        status: getAttendance.status,
      });
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof NotFoundError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },
};
