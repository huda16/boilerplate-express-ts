import ClientError from "../ClientError";
import ValidationError from "../ValidationError";

describe("ValidationError", () => {
  it("should create error correctly", () => {
    const validationError = new ValidationError("name required");

    expect(validationError).toBeInstanceOf(ValidationError);
    expect(validationError).toBeInstanceOf(ClientError);
    expect(validationError).toBeInstanceOf(Error);

    expect(validationError.message).toEqual("name required");
    expect(validationError.statusCode).toEqual(400);
    expect(validationError.name).toEqual("ValidationError");
  });
});
