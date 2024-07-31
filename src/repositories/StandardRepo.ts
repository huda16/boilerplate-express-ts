import { EntityTarget, Repository, ObjectLiteral, DeepPartial } from "typeorm";
import { OracleDataSource } from "../services/database/oracle/dataSource"; // Use named import

// Define a generic type that extends ObjectLiteral and requires an id property
interface Identifiable {
  id: number;
}

export default class StandardRepo<T extends ObjectLiteral & Identifiable> {
  private readonly repository: Promise<Repository<T>>;

  constructor(entity: EntityTarget<T>) {
    this.repository = OracleDataSource.initialize().then((conn) =>
      conn.getRepository(entity)
    );
  }

  // Retrieve all records
  async findAll(): Promise<T[]> {
    return (await this.repository).find();
  }

  // Retrieve a single record by ID
  async findById(id: number): Promise<T | null> {
    return (await this.repository).findOneBy({ id } as Partial<T>);
  }

  // Create a new record
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = (await this.repository).create(data);
    return (await this.repository).save(entity);
  }

  // Update an existing record by ID
  async update(id: number, data: Partial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null; // Entity not found
    }

    const updatedEntity = Object.assign(entity, data);
    return (await this.repository).save(updatedEntity);
  }

  // Delete a record by ID
  async delete(id: number): Promise<boolean> {
    const result = await (await this.repository).delete(id);
    return result.affected ? true : false; // Return true if deleted
  }

  // Find records by specified criteria
  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    return (await this.repository).findBy(criteria);
  }

  // Count total records
  async count(): Promise<number> {
    return (await this.repository).count();
  }
}
