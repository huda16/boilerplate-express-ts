import { body } from "express-validator";
import UsersRepository from "../../../repositories/auth/UsersRepository";
import { Users } from "../../../entities/auth/Users";

// Custom validator to check the uniqueness of a field using UsersRepository
const isUnique = (field: keyof Users, message: string) => {
  return body(field as string).custom(async (value, { req }) => {
    const isUnique = await UsersRepository.isUnique(
      field,
      value,
      req.params?.id
    );
    if (!isUnique) {
      return Promise.reject(message);
    }
  });
};

// Regular expression to validate username: no whitespace or special characters
const usernameValidation = body("username")
  .notEmpty()
  .withMessage("Username is required")
  .matches(/^[a-zA-Z0-9]+$/)
  .withMessage("Username must not contain whitespace or special characters");

export const validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  usernameValidation,
  isUnique("username", "Username is already taken"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (value, { req }) => {
      const isUnique = await UsersRepository.isUnique(
        "email",
        value,
        req.params?.id
      );
      if (!isUnique) {
        return Promise.reject("Email is already taken");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateUpdateUser = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  usernameValidation.optional(), // Make it optional for update
  isUnique("username", "Username is already taken"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (value, { req }) => {
      const isUnique = await UsersRepository.isUnique(
        "email",
        value,
        req.params?.id
      );
      if (!isUnique) {
        return Promise.reject("Email is already taken");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
