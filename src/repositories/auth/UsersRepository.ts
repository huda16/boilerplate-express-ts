import { Request } from "express";
import { Users } from "../../entities/auth/Users";
import StandardRepo from "../StandardRepo";
import bcrypt from "bcrypt";

class UsersRepository extends StandardRepo<Users> {
  constructor() {
    super(Users);
  }

  // Get Index
  async getIndex(request: Request): Promise<
    | Users[]
    | {
        data: Users[];
        current_page: number;
        last_page: number;
        first_page_url: string;
        last_page_url: string;
        links: [];
        path: string;
        prev_page_url: string | null;
        next_page_url: string | null;
        limit: number; // limit
        from: number;
        to: number;
        total: number;
      }
  > {
    let data:
      | Users[]
      | {
          data: Users[];
          current_page: number;
          last_page: number;
          first_page_url: string;
          last_page_url: string;
          links: [];
          path: string;
          prev_page_url: string | null;
          next_page_url: string | null;
          limit: number; // limit
          from: number;
          to: number;
          total: number;
        } = [];

    // Check if the request has the 'table' query parameter
    const hasTableParam = request.query.table !== undefined;

    if (hasTableParam) {
      const nameToPath = {
        id: "id",
        name: "name",
        username: "username",
        email: "email",
        picture: "picture",
        role_name: "role_name",
        master_menu: "master_menu",
        activated_at: "activated_at",
        birth_place: "birth_place",
        birth_date: "birth_date",
        religion: "religion",
        created_by: "created_by",
        created_at: "created_at",
      };
      const searchable = this.delArrByKey(nameToPath, ["id"]);

      data = await this.queries(request, nameToPath, searchable, true);
    } else {
      data = await this.getList(request);
    }

    return data;
  }

  // Remove keys from an object
  private delArrByKey(
    obj: { [key: string]: string },
    keysToRemove: string[]
  ): { [key: string]: string } {
    const newObj = { ...obj };
    for (const key of keysToRemove) {
      delete newObj[key];
    }
    return newObj;
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
