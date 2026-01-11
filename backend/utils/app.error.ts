import { StatusCodes } from "http-status-codes";

export interface AppError extends Error {
  statusCode: number;
}

export class ConflictError implements AppError {
  statusCode: number;
  message: string;
  name: string;
  constructor(message: string) {
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.name = "ConflictError";
  }
}

export class ValidationError implements AppError {
  statusCode: number;
  message: string;
  name: string;
  constructor(message: string) {
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.name = "ValidationError";
  }
}

export class UnauthorizedError implements AppError {
  message: string;
  statusCode: number;
  name: string;

  constructor(message: string) {
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError implements AppError {
  message: string;
  statusCode: number;
  name: string;

  constructor(message: string) {
    this.message = message;
    this.statusCode = StatusCodes.FORBIDDEN;
    this.name = "ForbiddenError";
  }
}

export class NotFoundError implements AppError {
  message: string;
  statusCode: number;
  name: string;

  constructor(message: string) {
    this.message = message;
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "NotFoundError";
  }
}
