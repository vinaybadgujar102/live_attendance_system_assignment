import { StatusCodes } from "http-status-codes";

interface AppError extends Error {
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
