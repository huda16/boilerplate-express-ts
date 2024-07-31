import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ValidationError from "../utils/exceptions/ValidationError";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage =
      "Validation failed: " +
      errors
        .array()
        .map((err) => err.msg)
        .join(", ");
    throw new ValidationError(errorMessage);
  }
  next();
};
