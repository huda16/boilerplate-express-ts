import { Response } from "express";

interface SuccessResponse<T> {
  status: "success";
  data: T;
  meta?: Meta;
}

export function sendSuccessResponse<T>({
  res,
  data,
  meta,
  statusCode = 200,
}: {
  res: Response;
  data: T;
  meta?: Meta;
  statusCode: number;
}): Response {
  const response: SuccessResponse<T> = {
    status: "success",
    data,
    meta,
  };
  return res.status(statusCode).json(response);
}
