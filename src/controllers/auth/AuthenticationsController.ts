import { Request, Response, NextFunction } from "express";
import AuthenticationsRepository from "../../repositories/auth/AuthenticationsRepository";
import { sendSuccessResponse } from "../../utils/helpers/responseHelpers";
import NotFoundError from "../../utils/exceptions/NotFoundError";

class AuthenticationsController {
  // Create a new auth
  async createAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
      const authentication = await AuthenticationsRepository.createToken(req.body);
      return sendSuccessResponse(res, authentication, 201);
    } catch (error) {
      console.error("Error creating authentication:", error);
      next(error);
    }
  }

  // Update auth
  async updateAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
      const authentication = await AuthenticationsRepository.refresh(req.body);
      if (!authentication) {
        return next(new NotFoundError("Authentication not found")); 
      }
      return sendSuccessResponse(res, authentication, 200);
    } catch (error) {
      console.error("Error updating authentication:", error);
      next(error);
    }
  }

  // Delete auth
  async deleteAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthenticationsRepository.deleteToken(req.body);

      return sendSuccessResponse(res, "Authentication successfully deleted", 200);
    } catch (error) {
      console.error("Error deleting user:", error);
      next(error);
    }
  }
}

export default new AuthenticationsController();
