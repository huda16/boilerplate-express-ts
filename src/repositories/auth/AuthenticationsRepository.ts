import { Authentications } from "../../entities/auth/Authentications";
import StandardRepo from "../StandardRepo";
import BcryptPasswordHash from "../../services/security/BcryptPasswordHash";
import JwtTokenManager from "../../services/security/JwtTokenManager";
import UsersRepository from "./UsersRepository";
import AuthenticationError from "../../utils/exceptions/AuthenticationError";
import InvariantError from "utils/exceptions/InvariantError";

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
  async createToken(
    data: any
  ): Promise<{
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
      throw new AuthenticationError("User not found");
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
  // async refresh(
  //   refreshToken: string
  // ): Promise<{ accessToken: string; refreshToken: string }> {
  //   try {
  //     if (!this.repository) {
  //       throw new Error("Repository not initialized");
  //     }

  //     await this.tokenManager.verifyRefreshToken(refreshToken);
  //     const payload = await this.tokenManager.decodePayload(refreshToken);
  //     const accessToken = await this.tokenManager.createAccessToken(payload);
  //     const newRefreshToken = await this.tokenManager.createRefreshToken(
  //       payload
  //     );

  //     // Update the refresh token in the database
  //     const entity = await this.repository.findOneBy({
  //       token: refreshToken,
  //     } as Partial<Authentications>);
  //     if (entity) {
  //       entity.token = newRefreshToken;
  //       await this.repository.save(entity);
  //     }

  //     return { accessToken, refreshToken: newRefreshToken };
  //   } catch (error) {
  //     throw DomainErrorTranslator.translate(error);
  //   }
  // }

  // // Delete a refresh token
  // async deleteToken(token: string): Promise<void> {
  //   try {
  //     if (!this.repository) {
  //       throw new Error("Repository not initialized");
  //     }

  //     const entity = await this.repository.findOneBy({
  //       token,
  //     } as Partial<Authentications>);
  //     if (entity) {
  //       await this.repository.remove(entity);
  //     }
  //   } catch (error) {
  //     throw DomainErrorTranslator.translate(error);
  //   }
  // }
}

export default new AuthenticationsRepository();
