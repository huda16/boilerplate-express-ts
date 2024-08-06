import { Request, Response, NextFunction } from "express";
import UsersRepository from "../../repositories/auth/UsersRepository";
import { sendSuccessResponse } from "../../utils/helpers/responseHelpers";
import NotFoundError from "../../utils/exceptions/NotFoundError";

class UsersController {
  // Create a new user
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.created_by = req.auth?.username;
      req.body.created_at = new Date();
      const user = await UsersRepository.create(req.body);
      return sendSuccessResponse(res, user, 201);
    } catch (error) {
      console.error("Error creating user:", error);
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UsersRepository.getIndex(req);
      return sendSuccessResponse(res, users, 200);
    } catch (error) {
      console.error("Error retrieving users:", error);
      next(error);
    }
  }

  // Get a user by ID
  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await UsersRepository.findById(Number(id));
      if (!user) {
        return next(new NotFoundError("User not found")); 
      }
      return sendSuccessResponse(res, user, 200);
    } catch (error) {
      console.error("Error retrieving user:", error);
      next(error);
    }
  }

  // Update a user by ID
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      console.log(req.auth?.username);
      req.body.updated_by = req.auth?.username;
      req.body.updated_at = new Date();
      const updatedUser = await UsersRepository.update(Number(id), req.body);
      if (!updatedUser) {
        return next(new NotFoundError("User not found")); 
      }
      return sendSuccessResponse(res, updatedUser, 200);
    } catch (error) {
      console.error("Error updating user:", error);
      next(error);
    }
  }

  // Delete a user by ID
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const permanent = req.query.permanent === "true";

    try {
      const deleted = await UsersRepository.delete(Number(id), permanent, req.auth?.username);
      if (!deleted) {
        return next(new NotFoundError("User not found")); 
      }
      return sendSuccessResponse(res, `User with ID ${id} successfully deleted`, 200);
    } catch (error) {
      console.error("Error deleting user:", error);
      next(error);
    }
  }

  // Restore a user by ID
  async restoreUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const restored = await UsersRepository.restore(Number(id));
      if (!restored) {
        return next(new NotFoundError("User not found")); 
      }
      return sendSuccessResponse(res, `User with ID ${id} successfully restored`, 200);
    } catch (error) {
      console.error("Error deleting user:", error);
      next(error);
    }
  }
}

export default new UsersController();
