import { Users } from "../../entities/auth/Users"; // Adjust the import path as needed
import StandardRepo from "../StandardRepo";

class UsersRepository extends StandardRepo<Users> {
  constructor() {
    super(Users);
  }

  // You can add any user-specific methods here if needed
}

export default new UsersRepository();
