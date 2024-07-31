import bcrypt from "bcrypt";
import PasswordHash from "../../utils/security/PasswordHash";
import AuthenticationError from "../../utils/exceptions/AuthenticationError";

class BcryptPasswordHash extends PasswordHash {
  private saltRound: number;

  constructor(saltRound = 10) {
    super();
    this.saltRound = saltRound;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }

    return result;
  }
}

export default BcryptPasswordHash;
