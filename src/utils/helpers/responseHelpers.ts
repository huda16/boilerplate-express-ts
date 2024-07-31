import { Response } from "express";

interface SuccessResponse<T> {
  status: "success";
  data: T;
}

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  statusCode = 200
): Response {
  const response: SuccessResponse<T> = {
    status: "success",
    data,
  };
  return res.status(statusCode).json(response);
}
