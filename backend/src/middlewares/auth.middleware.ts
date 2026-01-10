import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../../utils/app.response";
import { StatusCodes } from "http-status-codes";
import { verifyToken, type AuthPayload } from "../../utils/token.utils";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Unauthorized, token missing or invalid",
    );
  }

  try {
    const decodedToken = verifyToken(token);

    req.user = decodedToken;
    next();
  } catch {
    return errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Unauthorized, token missing or invalid",
    );
  }
};
