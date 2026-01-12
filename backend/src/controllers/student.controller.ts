import type { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../../utils/app.error";

const userService = new UserService(new UserRepository());

export const studentController = {
  async getAllStudents(req: Request, res: Response) {
    try {
      const students = await userService.getAllStudents();
      const responseData = students.map((student) => {
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
        };
      });

      successResponse(res, StatusCodes.OK, responseData);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },
};
