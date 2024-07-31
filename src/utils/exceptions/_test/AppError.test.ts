import AppError from "../AppError";

describe("AppError", () => {
  it("should create an instance of AppError with default properties", () => {
    const errorMessage = "An error occurred";
    const error = new AppError(errorMessage);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe(errorMessage);
    expect(error.isServer).toBe(false); // Default isServer value
    expect(error.name).toBe("AppError");
  });

  it("should create an instance of AppError with a custom isServer property", () => {
    const errorMessage = "Server error occurred";
    const error = new AppError(errorMessage, true);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe(errorMessage);
    expect(error.isServer).toBe(true); // Custom isServer value
    expect(error.name).toBe("AppError");
  });
});
