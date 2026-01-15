import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";
import { AttendanceService } from "../services/attendance.service";
import { ClassRepository } from "../repositories/class.repository";
import { ForbiddenError, NotFoundError } from "../../utils/app.error";

const attendanceService = new AttendanceService(new ClassRepository());

export const attendanceController = {
  async startAttendance(req: Request, res: Response) {
    try {
      const { classId } = req.body;
      const { userId } = req.user!;
      const newSession = await attendanceService.startAttendance(
        classId,
        userId,
      );
      return successResponse(res, StatusCodes.OK, {
        classId: newSession.classId,
        startedAt: newSession.startedAt,
      });
    } catch (error) {
      if (error instanceof ForbiddenError || error instanceof NotFoundError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },
};
