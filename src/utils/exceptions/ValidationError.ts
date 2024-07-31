import ClientError from "./ClientError";

class ValidationError extends ClientError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export default ValidationError;
