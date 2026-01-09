import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { type ZodObject } from "zod";

// TODO:: Add static typing for req

export const validateRequestBody = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Invalid request schema",
      });
    }
  };
};
