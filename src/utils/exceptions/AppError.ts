class AppError extends Error {
  public isServer: boolean;

  constructor(message: string, isServer: boolean = false) {
    super(message);
    this.isServer = isServer;
    this.name = "AppError";
  }
}

export default AppError;
