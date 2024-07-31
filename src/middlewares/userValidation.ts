import { body } from "express-validator";

export const validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateUpdateUser = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("Username cannot be empty"),
  body("email").optional().isEmail().withMessage("Email is invalid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
