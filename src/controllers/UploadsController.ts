import { NextFunction, Request, Response } from "express";
import StorageService from "../services/storage/StorageService";
import ValidationError from "../utils/exceptions/ValidationError";
import { sendSuccessResponse } from "../utils/helpers/responseHelpers";

const storageService = new StorageService("uploads");

// Extend the Express Request interface to include Multer's file property
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

class UploadsController {
  async uploadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const multerRequest = req as MulterRequest;

    // Check if file is uploaded
    if (!multerRequest.file) {
      console.error("File upload error: No file uploaded");
      throw new ValidationError("No file uploaded");
    }

    try {
      const filename = await storageService.writeFile(multerRequest.file);
      return sendSuccessResponse(res, filename, 200);
    } catch (error) {
      console.error("Error upload file:", error);
      next(error);
    }
  }
}

export default new UploadsController();
