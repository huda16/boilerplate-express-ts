import bcrypt from "bcrypt";
import AuthenticationError from "../../../utils/exceptions/AuthenticationError";
import BcryptPasswordHash from "../BcryptPasswordHash";

describe("BcryptPasswordHash", () => {
  describe("hash function", () => {
    it("should encrypt password correctly", async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, "hash");
      const bcryptPasswordHash = new BcryptPasswordHash(10); // Pass saltRound as parameter

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash("plain_password");

      // Assert
      expect(typeof encryptedPassword).toEqual("string");
      expect(encryptedPassword).not.toEqual("plain_password");
      expect(spyHash).toBeCalledWith("plain_password", 10);
    });
  });

  describe("comparePassword function", () => {
    it("should throw AuthenticationError if password does not match", async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(10);

      // Act & Assert
      await expect(
        bcryptPasswordHash.comparePassword(
          "plain_password",
          "encrypted_password"
        )
      ).rejects.toThrow(AuthenticationError);
    });

    it("should not throw AuthenticationError if password matches", async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(10);
      const plainPassword = "secret";
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Act & Assert
      await expect(
        bcryptPasswordHash.comparePassword(plainPassword, encryptedPassword)
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});
