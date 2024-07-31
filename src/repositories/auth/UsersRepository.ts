import { Users } from "../../entities/auth/Users";
import StandardRepo from "../StandardRepo";
import bcrypt from "bcrypt";

class UsersRepository extends StandardRepo<Users> {
  constructor() {
    super(Users);
  }

  // Create a new user with hashed password
  async create(data: Users): Promise<Users> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password with a salt rounds of 10
    const entity = this.repository.create({
      ...data,
      password: hashedPassword, // Replace plain password with hashed password
    });
    return this.repository.save(entity);
  }

  // Update a user with hashed password if provided
  async update(id: number, data: Partial<Users>): Promise<Users | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const entity = await this.findById(id);
    if (!entity) {
      return null; // User not found
    }

    // Hash the password if it is provided in the update data
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(entity, data); // Merge the updated data with the existing entity
    return this.repository.save(entity);
  }
}

export default new UsersRepository();
