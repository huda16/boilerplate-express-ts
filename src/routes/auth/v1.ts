import { Router } from "express";
import UsersController from "../../controllers/UsersController";
import { handleValidationErrors } from "../../middlewares/validationResultMiddleware";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middlewares/validations/auth/userValidation";
import { validateCreateAuth, validateUpdateAuth } from "middlewares/validations/auth/authenticationValidation";
import AuthenticationsController from "controllers/AuthenticationsController";

const router = Router();

// User routes
router.post(
  "/users",
  validateCreateUser,
  handleValidationErrors,
  UsersController.createUser
);
router.get("/users", UsersController.getAllUsers);
router.get("/users/:id", UsersController.getUserById);
router.put(
  "/users/:id",
  validateUpdateUser,
  handleValidationErrors,
  UsersController.updateUser
);
router.delete("/users/:id", UsersController.deleteUser);

// Auth routes
router.post(
  "/authentications",
  validateCreateAuth,
  handleValidationErrors,
  AuthenticationsController.createAuthentication
);
// router.put(
//   "/authentications",
//   validateUpdateAuth,
//   handleValidationErrors,
//   AuthenticationsController.updateUser
// );
// router.delete(
//   "authentications",
//   validateUpdateAuth,
//   handleValidationErrors,
//   AuthenticationsController.deleteUser
// );

export default router;
