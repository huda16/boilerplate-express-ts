import { Router } from "express";
import UsersController from "../../controllers/UsersController";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middlewares/userValidation";
import { handleValidationErrors } from "../../middlewares/validationResultMiddleware";

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

export default router;
