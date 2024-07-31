class AuthenticationTokenManager {
  async createRefreshToken(payload: object): Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async createAccessToken(payload: object): Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async verifyRefreshToken(token: string): Promise<void> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async decodePayload(token: string): Promise<object> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

export default AuthenticationTokenManager;
