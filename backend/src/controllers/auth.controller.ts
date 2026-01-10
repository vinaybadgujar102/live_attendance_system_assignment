import type { Response, Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ConflictError, UnauthorizedError } from "../../utils/app.error";
import { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../../utils/app.response";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const newUser = await userService.createUser(req.body);

      return successResponse(res, StatusCodes.CREATED, {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },

  async login(req: Request, res: Response) {
    try {
      const token = await userService.login(req.body);
      return successResponse(res, StatusCodes.OK, { token });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return errorResponse(res, error.statusCode, error.message);
      }
    }
  },
};
