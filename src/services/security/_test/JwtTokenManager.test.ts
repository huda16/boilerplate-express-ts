import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import JwtTokenManager from "../JwtTokenManager";
import InvariantError from "../../../utils/exceptions/InvariantError";
import AuthenticationError from "../../../utils/exceptions/AuthenticationError";

describe("JwtTokenManager", () => {
  let jwtTokenManager: JwtTokenManager;

  beforeAll(() => {
    jwtTokenManager = new JwtTokenManager();
    process.env.ACCESS_TOKEN_KEY = "testAccessKey";
    process.env.REFRESH_TOKEN_KEY = "testRefreshKey";
  });

  describe("createAccessToken", () => {
    it("should create a valid access token", async () => {
      const payload = { userId: "123" };
      const token = await jwtTokenManager.createAccessToken(payload);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);

      expect(decoded).toHaveProperty("userId", payload.userId);
      expect(decoded).toHaveProperty("iat"); // Check for the iat property
      expect(decoded).toHaveProperty("exp"); // Check for the exp property
    });
  });

  describe("createRefreshToken", () => {
    it("should create a valid refresh token", async () => {
      const payload = { userId: "123" };
      const token = await jwtTokenManager.createRefreshToken(payload);
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_KEY as string
      );

      expect(decoded).toHaveProperty("userId", payload.userId);
      expect(decoded).toHaveProperty("iat"); // Check for the iat property
      expect(decoded).toHaveProperty("exp"); // Check for the exp property
    });
  });

  describe("verifyRefreshToken", () => {
    it("should not throw an error for a valid refresh token", async () => {
      const payload = { userId: "123" };
      const token = await jwtTokenManager.createRefreshToken(payload);
      await expect(
        jwtTokenManager.verifyRefreshToken(token)
      ).resolves.not.toThrow();
    });

    it("should throw an InvariantError for an invalid refresh token", async () => {
      await expect(
        jwtTokenManager.verifyRefreshToken("invalidToken")
      ).rejects.toThrow(InvariantError);
    });
  });

  describe("decodePayload", () => {
    it("should decode a valid token payload", async () => {
      const payload = { userId: "123" };
      const token = await jwtTokenManager.createAccessToken(payload);
      const decoded = await jwtTokenManager.decodePayload(token);

      expect(decoded).toHaveProperty("userId", payload.userId);
      expect(decoded).toHaveProperty("iat"); // Check for the iat property
      expect(decoded).toHaveProperty("exp"); // Check for the exp property
    });

    it("should throw an InvariantError for an invalid token", async () => {
      await expect(
        jwtTokenManager.decodePayload("invalidToken")
      ).rejects.toThrow(InvariantError);
    });
  });

  describe("authenticateJWT", () => {
    it("should call next() for a valid access token", () => {
      const payload = { userId: "123" };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY as string);
      const req = { headers: { authorization: `Bearer ${token}` } } as Request;
      const next = jest.fn() as NextFunction;

      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jwtTokenManager.authenticateJWT(req, res, next);
      expect(next).toHaveBeenCalledWith(); // Ensure next() is called without arguments
    });

    it("should throw an AuthenticationError for missing token", () => {
      const req = { headers: {} } as Request;
      const next = jest.fn() as NextFunction;

      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jwtTokenManager.authenticateJWT(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError)); // Expect an AuthenticationError
    });

    it("should throw an AuthenticationError for invalid token", () => {
      const req = {
        headers: { authorization: "Bearer invalidToken" },
      } as Request;
      const next = jest.fn() as NextFunction;

      const res = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      jwtTokenManager.authenticateJWT(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError)); // Expect an AuthenticationError
    });
  });
});
