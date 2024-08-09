import { body } from "express-validator";

export const validatePermission = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("slug").optional().isString().withMessage("Slug must be a string"),
];