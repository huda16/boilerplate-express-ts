import { Authentications } from "../../entities/auth/Authentications";
import StandardRepo from "../StandardRepo";
import BcryptPasswordHash from "../../services/security/BcryptPasswordHash";
import JwtTokenManager from "../../services/security/JwtTokenManager";
import UsersRepository from "./UsersRepository";
import AuthenticationError from "../../utils/exceptions/AuthenticationError";
import ValidationError from "../../utils/exceptions/ValidationError";

class AuthenticationsRepository extends StandardRepo<Authentications> {
  private passwordHash: BcryptPasswordHash;
  private tokenManager: JwtTokenManager;
  private userRepository: typeof UsersRepository;

  constructor() {
    super(Authentications);
    this.passwordHash = new BcryptPasswordHash();
    this.tokenManager = new JwtTokenManager();
    this.userRepository = UsersRepository;
  }

  // Create authentication tokens for a user
  async createToken(data: any): Promise<{
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  }> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const user = await this.userRepository.findOneBy({
      username: data.username,
    });
    if (!user) {
      throw new ValidationError("User not found");
    }

    const isPasswordValid = await this.passwordHash.comparePassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const payload = { id: user.id, username: user.username };
    const accessToken = await this.tokenManager.createAccessToken(payload);
    const refreshToken = await this.tokenManager.createRefreshToken(payload);
    const accessDecode = await this.tokenManager.decodePayload(accessToken);
    const refreshDecode = await this.tokenManager.decodePayload(refreshToken);
    const accessTokenExpiresAt = accessDecode.exp;
    const refreshTokenExpiresAt = refreshDecode.exp;

    const entity = this.repository.create({
      token: refreshToken,
    });
    await this.repository.save(entity);

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  // Refresh authentication tokens
  async refresh(data: { refreshToken: string }): Promise<{
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  }> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const refreshToken = await this.repository.findOneBy({
      token: data.refreshToken,
    } as Partial<Authentications>);

    if (!refreshToken) {
      throw new ValidationError("Refresh token invalid");
    }

    await this.tokenManager.verifyRefreshToken(data.refreshToken);
    const payload = await this.tokenManager.decodePayload(data.refreshToken);

    // Remove the exp property from the payload
    const { exp, ...newPayload } = payload;

    const accessToken = await this.tokenManager.createAccessToken(newPayload);
    const newRefreshToken = await this.tokenManager.createRefreshToken(
      newPayload
    );
    const accessDecode = await this.tokenManager.decodePayload(accessToken);
    const refreshDecode = await this.tokenManager.decodePayload(
      newRefreshToken
    );
    const accessTokenExpiresAt = accessDecode.exp;
    const refreshTokenExpiresAt = refreshDecode.exp;

    // Update the refresh token in the database
    const entity = await this.repository.findOneBy({
      token: data.refreshToken,
    } as Partial<Authentications>);
    if (entity) {
      entity.token = newRefreshToken;
      await this.repository.save(entity);
    }

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt,
    };
  }

  // Delete a refresh token
  async deleteToken(data: { refreshToken: string }): Promise<void> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const entity = await this.repository.findOneBy({
      token: data.refreshToken,
    } as Partial<Authentications>);

    if (!entity) {
      throw new ValidationError("Refresh token does not exist in Database")
    }

    await this.repository.remove(entity);
  }
}

export default new AuthenticationsRepository();
