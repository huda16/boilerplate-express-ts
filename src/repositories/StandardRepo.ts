import { EntityTarget, Repository, ObjectLiteral, DeepPartial } from "typeorm";
import { OracleDataSource } from "../services/database/oracle/dataSource"; // Use named import

// Define a generic type that extends ObjectLiteral and requires an id property
interface Identifiable {
  id: number;
}

export default class StandardRepo<T extends ObjectLiteral & Identifiable> {
  protected repository?: Repository<T>; // Declare as optional

  constructor(entity: EntityTarget<T>) {
    this.initializeRepository(entity);
  }

  // Initialize the repository
  private async initializeRepository(entity: EntityTarget<T>) {
    const connection = await OracleDataSource.initialize();
    this.repository = connection.getRepository(entity);
  }

  // Retrieve all records
  async findAll(): Promise<T[]> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.find();
    } catch (error) {
      console.error("Error finding all records:", error);
      throw new Error("Could not retrieve records");
    }
  }

  // Retrieve a single record by ID
  async findById(id: number): Promise<T | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.findOneBy({ id } as Partial<T>);
    } catch (error) {
      console.error(`Error finding record with id ${id}:`, error);
      throw new Error(`Could not find record with id ${id}`);
    }
  }

  // Create a new record
  async create(data: DeepPartial<T>): Promise<T> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    const entity = this.repository.create(data);
    try {
      return await this.repository.save(entity);
    } catch (error) {
      console.error("Error creating record:", error);
      throw new Error("Could not create record");
    }
  }

  // Update an existing record by ID
  async update(id: number, data: Partial<T>): Promise<T | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    const entity = await this.findById(id);
    if (!entity) {
      return null; // Entity not found
    }

    const updatedEntity = Object.assign(entity, data);
    try {
      return await this.repository.save(updatedEntity);
    } catch (error) {
      console.error(`Error updating record with id ${id}:`, error);
      throw new Error(`Could not update record with id ${id}`);
    }
  }

  // Delete a record by ID
  async delete(id: number): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      const result = await this.repository.delete(id);
      return result.affected ? true : false; // Return true if deleted
    } catch (error) {
      console.error(`Error deleting record with id ${id}:`, error);
      throw new Error(`Could not delete record with id ${id}`);
    }
  }

  // Find a record by specified criteria
  async findOneBy(criteria: any): Promise<any> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.findOneBy(criteria);
    } catch (error) {
      console.error("Error finding records by criteria:", error);
      throw new Error("Could not find records by criteria");
    }
  }

  // Find records by specified criteria
  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.findBy(criteria);
    } catch (error) {
      console.error("Error finding records by criteria:", error);
      throw new Error("Could not find records by criteria");
    }
  }

  // Count total records
  async count(): Promise<number> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.count();
    } catch (error) {
      console.error("Error counting records:", error);
      throw new Error("Could not count records");
    }
  }
}
