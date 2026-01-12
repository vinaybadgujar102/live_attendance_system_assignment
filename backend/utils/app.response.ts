import type { Response } from "express";

type ApiSuccessReponse<T> = {
  success: true;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  error: string;
};

export const successResponse = <
  T extends Record<string, unknown> | Array<unknown>,
>(
  res: Response,
  statusCode: number,
  data: T,
) => {
  const response: ApiSuccessReponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  errorMessage: string,
) => {
  const response: ApiErrorResponse = {
    success: false,
    error: errorMessage,
  };
  return res.status(statusCode).json(response);
};
