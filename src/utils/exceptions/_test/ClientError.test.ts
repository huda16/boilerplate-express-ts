// @ts-nocheck
import ClientError from "../ClientError";

describe("ClientError", () => {
  it("should throw error when directly use it", () => {
    expect(() => new ClientError("")).toThrow(
      "Cannot instantiate abstract class"
    );
  });
});
