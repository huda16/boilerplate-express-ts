class ClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);

    if (new.target === ClientError) {
      throw new Error("Cannot instantiate abstract class");
    }

    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

export default ClientError;
