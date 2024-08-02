import {
  EntityTarget,
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  FindOperator,
  IsNull,
} from "typeorm";
import { OracleDataSource } from "../services/database/oracle/dataSource";

// Define a generic type that extends ObjectLiteral and requires an id and deleted_at property
interface Identifiable {
  id: number;
  deleted_at?: Date | null; // Add deleted_at as optional
}

export default class StandardRepo<T extends ObjectLiteral & Identifiable> {
  protected repository?: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.initializeRepository(entity);
  }

  private async initializeRepository(entity: EntityTarget<T>) {
    const connection = await OracleDataSource.initialize();
    this.repository = connection.getRepository(entity);
  }

  // Retrieve all records, excluding soft-deleted ones
  async findAll(): Promise<T[]> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.find({
        where: { deleted_at: IsNull() } as FindOptionsWhere<T>,
      });
    } catch (error) {
      console.error("Error finding all records:", error);
      throw new Error("Could not retrieve records");
    }
  }

  // Retrieve a single record by ID, excluding soft-deleted ones
  async findById(id: number): Promise<T | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.findOne({
        where: { id, deleted_at: IsNull() } as FindOptionsWhere<T>,
      });
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

  // Delete a record by ID (soft or permanent based on the parameter)
  async delete(id: number, permanent: boolean = false): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      if (permanent) {
        const result = await this.repository.delete(id);
        return result.affected ? true : false; // Return true if deleted
      } else {
        const entity = await this.findById(id);
        if (!entity) {
          return false; // Entity not found
        }
        entity.deleted_at = new Date(); // Mark the record as deleted
        await this.repository.save(entity);
        return true;
      }
    } catch (error) {
      console.error(`Error deleting record with id ${id}:`, error);
      throw new Error(`Could not delete record with id ${id}`);
    }
  }

  // Find a record by specified criteria, excluding soft-deleted ones
  async findOneBy(criteria: any): Promise<T | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.findOne({
        where: {
          ...criteria,
          deleted_at: IsNull(),
        } as FindOptionsWhere<T>,
      });
    } catch (error) {
      console.error("Error finding records by criteria:", error);
      throw new Error("Could not find records by criteria");
    }
  }

  // Find records by specified criteria, excluding soft-deleted ones
  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.find({
        where: {
          ...criteria,
          deleted_at: IsNull(),
        } as FindOptionsWhere<T>,
      });
    } catch (error) {
      console.error("Error finding records by criteria:", error);
      throw new Error("Could not find records by criteria");
    }
  }

  // Count total records, excluding soft-deleted ones
  async count(): Promise<number> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      return await this.repository.count({
        where: { deleted_at: IsNull() } as FindOptionsWhere<T>,
      });
    } catch (error) {
      console.error("Error counting records:", error);
      throw new Error("Could not count records");
    }
  }

  // Custom validator to check the uniqueness of a field
  async isUnique(field: keyof T, value: any, id?: number): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    const criteria = {
      [field]: value,
      deleted_at: IsNull(),
    } as unknown as Partial<T>; // Use 'unknown' to bypass the type check
    const record = await this.repository.findOne({
      where: criteria as FindOptionsWhere<T>,
    });
    if (record && record.id !== id) {
      return false;
    }
    return true;
  }
}
