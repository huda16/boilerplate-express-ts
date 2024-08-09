import { Router } from "express";
import UsersController from "../../controllers/auth/UsersController";
import { handleValidationErrors } from "../../middlewares/validationResultMiddleware";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middlewares/validator/auth/userValidation";
import {
  validateCreateAuth,
  validateUpdateAuth,
} from "../../middlewares/validator/auth/authenticationValidation";
import AuthenticationsController from "../../controllers/auth/AuthenticationsController";
import JwtTokenManager from "../../services/security/JwtTokenManager";
import upload from "../../middlewares/upload"; // Assuming you have an upload middleware set up
import UploadsController from "../../controllers/UploadsController";
import { validateRoles } from "../../middlewares/validator/auth/roleValidation";
import RolesController from "controllers/auth/RolesController";
import { validatePermission } from "middlewares/validator/auth/permissionValidation";
import PermissionsController from "controllers/auth/PermissionsController";

const router = Router();
const jwtTokenManager = new JwtTokenManager();

// User routes
router.post(
  "/users",
  jwtTokenManager.authenticateJWT,
  validateCreateUser,
  handleValidationErrors,
  UsersController.createUser
);
router.get(
  "/users",
  jwtTokenManager.authenticateJWT,
  UsersController.getAllUsers
);
router.get(
  "/users/:id",
  jwtTokenManager.authenticateJWT,
  UsersController.getUserById
);
router.put(
  "/users/:id",
  jwtTokenManager.authenticateJWT,
  validateUpdateUser,
  handleValidationErrors,
  UsersController.updateUser
);
router.delete(
  "/users/:id",
  jwtTokenManager.authenticateJWT,
  UsersController.deleteUser
);
router.put(
  "/users/:id/restore",
  jwtTokenManager.authenticateJWT,
  UsersController.restoreUser
);

// Auth routes
router.get(
  "/authentications/me",
  jwtTokenManager.authenticateJWT,
  AuthenticationsController.me
);
router.post(
  "/authentications",
  validateCreateAuth,
  handleValidationErrors,
  AuthenticationsController.createAuthentication
);
router.put(
  "/authentications",
  validateUpdateAuth,
  handleValidationErrors,
  AuthenticationsController.updateAuthentication
);
router.delete(
  "/authentications",
  validateUpdateAuth,
  handleValidationErrors,
  AuthenticationsController.deleteAuthentication
);

// Role routes
router.post(
  "/roles",
  jwtTokenManager.authenticateJWT,
  validateRoles,
  handleValidationErrors,
  RolesController.createRole
);
router.get(
  "/roles",
  jwtTokenManager.authenticateJWT,
  RolesController.getAllRoles
);
router.get(
  "/roles/:id",
  jwtTokenManager.authenticateJWT,
  RolesController.getRoleById
);
router.put(
  "/roles/:id",
  jwtTokenManager.authenticateJWT,
  validateRoles,
  handleValidationErrors,
  RolesController.updateRole
);
router.delete(
  "/roles/:id",
  jwtTokenManager.authenticateJWT,
  RolesController.deleteRole
);
router.put(
  "/roles/:id/restore",
  jwtTokenManager.authenticateJWT,
  RolesController.restoreRole
);

// Permission roles
router.post(
  "/permissions",
  jwtTokenManager.authenticateJWT,
  validatePermission,
  handleValidationErrors,
  PermissionsController.createPermission
);
router.get(
  "/permissions",
  jwtTokenManager.authenticateJWT,
  PermissionsController.getAllPermissions
);
router.get(
  "/permissions/:id",
  jwtTokenManager.authenticateJWT,
  PermissionsController.getPermissionById
);
router.put(
  "/permissions/:id",
  jwtTokenManager.authenticateJWT,
  validatePermission,
  handleValidationErrors,
  PermissionsController.updatePermission
);
router.delete(
  "/permissions/:id",
  jwtTokenManager.authenticateJWT,
  PermissionsController.deletePermission
);
router.put(
  "/permissions/:id/restore",
  jwtTokenManager.authenticateJWT,
  PermissionsController.restorePermission
);

// Upload route
router.post("/uploads", upload.single("file"), (req, res, next) => {
  // Use the UploadsController here
  return UploadsController.uploadFile(req, res, next);
});

export default router;
