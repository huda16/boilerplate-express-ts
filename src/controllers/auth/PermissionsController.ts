import { Request, Response, NextFunction } from "express";
import PermissionsRepository from "../../repositories/auth/PermissionsRepository";
import { sendSuccessResponse } from "../../utils/helpers/responseHelpers";
import NotFoundError from "../../utils/exceptions/NotFoundError";

class PermissionsController {
  // Create a new permission
  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.created_by = req.auth?.username;
      req.body.created_at = new Date();
      const permission = await PermissionsRepository.create(req.body);
      return sendSuccessResponse({ res, data: permission, statusCode: 201 });
    } catch (error) {
      console.error("Error creating permission:", error);
      next(error);
    }
  }

  // Get all permissions
  async getAllPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await PermissionsRepository.getIndex(req);
      return sendSuccessResponse({
        res,
        data,
        meta,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error retrieving permissions:", error);
      next(error);
    }
  }

  // Get a permission by ID
  async getPermissionById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const permission = await PermissionsRepository.findById(Number(id));
      if (!permission) {
        return next(new NotFoundError("Permission not found"));
      }
      return sendSuccessResponse({ res, data: permission, statusCode: 200 });
    } catch (error) {
      console.error("Error retrieving permission:", error);
      next(error);
    }
  }

  // Update a permission by ID
  async updatePermission(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      req.body.updated_by = req.auth?.username;
      req.body.updated_at = new Date();
      const updatedPermission = await PermissionsRepository.update(Number(id), req.body);
      if (!updatedPermission) {
        return next(new NotFoundError("Permission not found"));
      }
      return sendSuccessResponse({ res, data: updatedPermission, statusCode: 200 });
    } catch (error) {
      console.error("Error updating permission:", error);
      next(error);
    }
  }

  // Delete a permission by ID
  async deletePermission(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const permanent = req.query.permanent === "true";

    try {
      const deleted = await PermissionsRepository.delete(
        Number(id),
        permanent,
        req.auth?.username
      );
      if (!deleted) {
        return next(new NotFoundError("Permission not found"));
      }
      return sendSuccessResponse({
        res,
        data: `Permission with ID ${id} successfully deleted`,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error deleting permission:", error);
      next(error);
    }
  }

  // Restore a permission by ID
  async restorePermission(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const restored = await PermissionsRepository.restore(Number(id));
      if (!restored) {
        return next(new NotFoundError("Permission not found"));
      }
      return sendSuccessResponse({
        res,
        data: `Permission with ID ${id} successfully restored`,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error deleting permission:", error);
      next(error);
    }
  }
}

export default new PermissionsController();
