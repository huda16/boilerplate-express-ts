import { Request, Response, NextFunction } from "express";
import AuthenticationsRepository from "../repositories/auth/AuthenticationsRepository";
import { sendSuccessResponse } from "../utils/helpers/responseHelpers";
import NotFoundError from "../utils/exceptions/NotFoundError";

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
  // async updateAuthentication(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const updatedUser = await AuthenticationsRepository.refresh(req.body);
  //     if (!updatedUser) {
  //       return next(new NotFoundError("User not found")); 
  //     }
  //     return res.status(200).json(updatedUser);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     const errorMessage =
  //       typeof error === "string"
  //         ? error
  //         : error instanceof Error
  //         ? error.message
  //         : "Unknown error occurred";
  //     next(new ValidationError(errorMessage));
  //   }
  // }

  // // Delete auth
  // async deleteAuthentication(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     await AuthenticationsRepository.deleteToken(req.body);

  //     return res.status(204).send(); // No content
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     const errorMessage =
  //       typeof error === "string"
  //         ? error
  //         : error instanceof Error
  //         ? error.message
  //         : "Unknown error occurred";
  //     next(new ValidationError(errorMessage));
  //   }
  // }
}

export default new AuthenticationsController();
