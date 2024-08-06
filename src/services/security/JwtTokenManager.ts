import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import InvariantError from "../../utils/exceptions/InvariantError";
import AuthenticationError from "../../utils/exceptions/AuthenticationError";
import AuthorizationError from "../../utils/exceptions/AuthorizationError";
import AuthenticationTokenManager from "../../utils/security/AuthenticationTokenManager";

class JwtTokenManager extends AuthenticationTokenManager {
  async createAccessToken(payload: object): Promise<string> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY as string, {
      expiresIn: "1h",
    });
  }

  async createRefreshToken(payload: object): Promise<string> {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY as string, {
      expiresIn: "30d",
    });
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      if (!process.env.REFRESH_TOKEN_KEY) {
        throw new InvariantError("Refresh token key is not defined");
      }

      if (typeof token !== "string") {
        throw new InvariantError("Refresh token must be a string");
      }

      jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvariantError("Refresh token invalid");
      }
      throw new Error("Unexpected error verifying refresh token");
    }
  }

  async decodePayload(token: string): Promise<any> {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      throw new InvariantError("Invalid token payload");
    }
    return decoded;
  }

  authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      next(new AuthenticationError("Unauthorized"));
      return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string, (err, user) => {
      if (err) {
        next(new AuthenticationError("Unauthorized, Your access token was expired"));
        return;
      }

      // Attach user info to request object
      req.auth = user;
      next();
    });
  }
}

export default JwtTokenManager;
