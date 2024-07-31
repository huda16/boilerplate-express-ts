import { Request, Response, NextFunction } from "express";
import ClientError from "../utils/exceptions/ClientError";
import AppError from "../utils/exceptions/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is an instance of AppError and is a server error
  const isServerError = err instanceof AppError && err.isServer;

  // Handle ClientError (e.g., validation errors)
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  // Handle other non-server errors
  if (!isServerError) {
    return res.status(400).json({
      status: "fail",
      message: err.message || "Bad request", // Provide a default message
    });
  }

  // Server error (e.g., unexpected errors)
  return res.status(500).json({
    status: "error",
    message: "An unexpected error occurred on our server.",
  });
};
