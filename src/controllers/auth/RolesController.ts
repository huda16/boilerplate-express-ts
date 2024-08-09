import { Request, Response, NextFunction } from "express";
import RolesRepository from "../../repositories/auth/RolesRepository";
import { sendSuccessResponse } from "../../utils/helpers/responseHelpers";
import NotFoundError from "../../utils/exceptions/NotFoundError";

class RolesController {
  // Create a new role
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.created_by = req.auth?.username;
      req.body.created_at = new Date();
      const role = await RolesRepository.create(req.body);
      return sendSuccessResponse({ res, data: role, statusCode: 201 });
    } catch (error) {
      console.error("Error creating role:", error);
      next(error);
    }
  }

  // Get all roles
  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await RolesRepository.getIndex(req);
      return sendSuccessResponse({
        res,
        data,
        meta,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error retrieving roles:", error);
      next(error);
    }
  }

  // Get a role by ID
  async getRoleById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const role = await RolesRepository.findById(Number(id));
      if (!role) {
        return next(new NotFoundError("Role not found"));
      }
      return sendSuccessResponse({ res, data: role, statusCode: 200 });
    } catch (error) {
      console.error("Error retrieving role:", error);
      next(error);
    }
  }

  // Update a role by ID
  async updateRole(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      req.body.updated_by = req.auth?.username;
      req.body.updated_at = new Date();
      const updatedRole = await RolesRepository.update(Number(id), req.body);
      if (!updatedRole) {
        return next(new NotFoundError("Role not found"));
      }
      return sendSuccessResponse({ res, data: updatedRole, statusCode: 200 });
    } catch (error) {
      console.error("Error updating role:", error);
      next(error);
    }
  }

  // Delete a role by ID
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const permanent = req.query.permanent === "true";

    try {
      const deleted = await RolesRepository.delete(
        Number(id),
        permanent,
        req.auth?.username
      );
      if (!deleted) {
        return next(new NotFoundError("Role not found"));
      }
      return sendSuccessResponse({
        res,
        data: `Role with ID ${id} successfully deleted`,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      next(error);
    }
  }

  // Restore a role by ID
  async restoreRole(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const restored = await RolesRepository.restore(Number(id));
      if (!restored) {
        return next(new NotFoundError("Role not found"));
      }
      return sendSuccessResponse({
        res,
        data: `Role with ID ${id} successfully restored`,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      next(error);
    }
  }
}

export default new RolesController();
