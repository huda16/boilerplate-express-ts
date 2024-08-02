import { body } from "express-validator";

export const validateCreateAuth = [
  body("username").optional().notEmpty().withMessage("Username is required"),
  body("password").optional().notEmpty().withMessage("Password is required"),
];

export const validateUpdateAuth = [
  body("refreshToken").notEmpty().withMessage("Refresh token cannot be empty"),
  body("refreshToken").isString().withMessage("Refresh token must be string"),
];
