import type { Response, Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import { ConflictError } from "../../utils/app.error";
import { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const newUser = await userService.createUser(req.body);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
