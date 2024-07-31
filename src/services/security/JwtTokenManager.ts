import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import InvariantError from "../../utils/exceptions/InvariantError";
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
      jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string);
    } catch (error) {
      throw new InvariantError("Refresh token invalid");
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
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  }
}

export default JwtTokenManager;

