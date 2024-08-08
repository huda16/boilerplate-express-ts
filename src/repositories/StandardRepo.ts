import {
  EntityTarget,
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  IsNull,
  Not,
  ILike,
  FindOperator,
  Between,
  In,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsOrderProperty,
  Brackets,
  ConnectionClosedEvent,
} from "typeorm";
import { OracleDataSource } from "../services/database/oracle/dataSource";
import { Request } from "express";
import { ParsedQs } from "qs";
import {
  escapeString,
  extractParamsAttribute,
  parseBetweenQuery,
  KeyValuePair,
} from "../utils/helpers/queryHelpers";

// Define a generic type that extends ObjectLiteral and requires an id and deleted_at property
interface Identifiable {
  id: number;
  deleted_by?: string | null; // Add deleted_at as optional
  deleted_at?: Date | null; // Add deleted_at as optional
}

export default class StandardRepo<T extends ObjectLiteral & Identifiable> {
  protected repository?: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    OracleDataSource.initialize()
      .then((connection) => {
        this.repository = connection.getRepository(entity);
      })
      .catch((error) => {
        console.error("Error initializing repository:", error);
      });
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

  // Retrieve all records, including trashed records if specified
  async findAll(
    payload?: any,
    additionalConditions?: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    searchable?: any,
    selectedFields?: string[]
  ): Promise<[T[], number]> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    try {
      // Create the base where condition
      const whereCondition: FindOptionsWhere<T> = {};

      // Determine the condition for deleted_at based on payload
      const isTrashed = payload?.trash === "true";
      const includeDeleted = payload?.include_deleted === "true";

      if (!includeDeleted) {
        if (isTrashed) {
          whereCondition.deleted_at = Not(IsNull()) as any;
        } else {
          whereCondition.deleted_at = IsNull() as any;
        }
      }

      // Safely merge additional conditions
      if (additionalConditions) {
        Object.assign(whereCondition, additionalConditions);
      }

      // Return the data with the provided order
      const queryBuilder = this.repository.createQueryBuilder("entity");

      // Apply where conditions
      if (Object.keys(whereCondition).length > 0) {
        queryBuilder.where(whereCondition);
      }

      // Apply quick search conditions
      if (payload?.search && searchable) {
        const searchConditions = Object.keys(searchable).map((key, index) => {
          const column = searchable[key];
          return `entity.${column} LIKE :search${index}`;
        });

        if (searchConditions.length > 0) {
          queryBuilder.andWhere(
            new Brackets((qb) => {
              searchConditions.forEach((condition, index) => {
                qb.orWhere(condition, {
                  [`search${index}`]: `%${payload.search}%`,
                });
              });
            })
          );
        }
      }

      // Apply order conditions
      if (order) {
        for (const [column, direction] of Object.entries(order)) {
          queryBuilder.addOrderBy(
            `entity.${column}`,
            direction as "ASC" | "DESC"
          );
        }
      }

      // Apply selected fields
      if (selectedFields?.length) {
        queryBuilder.select(selectedFields.map((field) => `entity.${field}`));
      }

      // Apply limit
      const limit = parseInt(payload.limit as string, 10);
      if (limit > 0) {
        queryBuilder.limit(limit);
      }

      // Apply pagination
      const currentPage = parseInt(payload?.page as string, 10) || 1;

      // Fetch total count of records for pagination
      const totalRecords = await queryBuilder.getCount();
      const totalPages = Math.ceil(totalRecords / limit);

      // Ensure page is within bounds
      const boundedPage = Math.max(1, Math.min(currentPage, totalPages));
      const offset = (boundedPage - 1) * limit;
      queryBuilder.offset(offset);

      return await queryBuilder.getManyAndCount();
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
  async delete(
    id: number,
    permanent: boolean = false,
    by?: string
  ): Promise<boolean> {
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
        entity.deleted_by = by; // Mark the record as deleted
        entity.deleted_at = new Date(); // Mark the record as deleted
        await this.repository.save(entity);
        return true;
      }
    } catch (error) {
      console.error(`Error deleting record with id ${id}:`, error);
      throw new Error(`Could not delete record with id ${id}`);
    }
  }

  // Restores soft-deleted records
  async restore(id: number): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      const entity = await this.repository.findOne({
        where: { id, deleted_at: Not(IsNull()) } as FindOptionsWhere<T>,
      });
      if (!entity) {
        return false;
      }
      entity.deleted_by = null;
      entity.deleted_at = null;
      await this.repository.save(entity);
      return true;
    } catch (error) {
      console.error(`Error restoring record with id ${id}:`, error);
      throw new Error(`Could not restore record with id ${id}`);
    }
  }

  async findOneBuilder(
    payload?: any,
    selectedFields?: string[]
  ): Promise<T | null> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      // Create the base where condition
      const whereCondition: FindOptionsWhere<T> = payload || {};
      const queryBuilder = this.repository.createQueryBuilder("entity");
      if (whereCondition) {
        queryBuilder.where(whereCondition);
      }

      if (selectedFields?.length) {
        queryBuilder
          .select(selectedFields.map((field) => `entity.${field}`))
          .addSelect(selectedFields.map((field) => `entity.${field}`));
      }

      return await queryBuilder.getOne();
    } catch (error) {
      console.error("Error finding records by criteria:", error);
      throw new Error("Could not find records by criteria");
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

  // Custom validator to check the uniqueness of a field
  async isUnique(field: keyof T, value: any, id?: number): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }

    const criteria = {
      [field]: value,
      deleted_at: IsNull(),
    } as unknown as Partial<T>; // Use 'unknown' to bypass the type check

    // If an ID is provided, exclude the current record from the criteria
    if (id !== undefined) {
      criteria.id = Not(id) as any; // Use Not with type assertion to 'any'
    }

    const record = await this.repository.findOne({
      where: criteria as FindOptionsWhere<T>,
    });

    // If a record is found, it means the value is not unique
    return record === null; // Return true if no record is found
  }

  // Logs data into an activity log
  async logger(
    data: any,
    id: number | null,
    saveResReq: boolean = false,
    request: any = null
  ): Promise<void> {
    const mode = id ? "u" : "c";
    // Implement logging logic here
  }

  // Custom query to get a list of records
  async getList(
    rawRequest: any,
    relations: any = null,
    countRelations: any = null
  ): Promise<{ data: T[] }> {
    try {
      const payload = rawRequest.query;
      const hasTableParam = payload.table !== undefined;
      let selectedFields: [] = [];
      if (payload.select) {
        selectedFields = JSON.parse(payload.select);
      }
      // Collect sorting conditions
      const order = await this.queryOrders(payload, null);
      if (hasTableParam) {
        const [data, rowCount] = await this.findAll(payload, undefined, order);
        return await this.rawToTable(rawRequest, data, rowCount);
      }

      const [data, rowCount] = await this.findAll(
        payload,
        undefined,
        order,
        undefined,
        selectedFields
      );

      // const data = await this.findAllWithRelations(rawRequest, relations);
      // if (countRelations) {
      // Implement countRelations logic here
      // }
      return { data };
    } catch (error) {
      console.error("Error getting list of records:", error);
      throw new Error("Could not get list of records");
    }
  }

  // Converts raw data to a table format
  async rawToTable(
    rawRequest: Request,
    data: any,
    total: number,
    selectedFields?: string[]
  ): Promise<{
    data: [];
    meta?: Meta;
  }> {
    try {
      const payload: ParsedQs = rawRequest.query; // Use ParsedQs type for query
      const limit = parseInt(payload.limit as string, 10);
      let currentPage = parseInt(payload.page as string) || 1;

      const totalPages = Math.ceil(total / limit); // Total pages available

      // Ensure currentPage is within bounds
      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * limit;
      const end = start + limit;

      // Extract the full path from the original request URL
      const originalPath = rawRequest.originalUrl.split("?")[0];

      // Construct the base URL for pagination links
      const baseUrl = `${rawRequest.protocol}://${rawRequest.get(
        "host"
      )}${originalPath}`;

      return {
        data: data,
        meta: {
          current_page: currentPage,
          last_page: totalPages,
          first_page_url: `${baseUrl}?table&page=1&limit=${limit}`,
          last_page_url: `${baseUrl}?table&page=${totalPages}&limit=${limit}`,
          links: [], // Implement if you need detailed pagination links
          path: baseUrl,
          prev_page_url:
            currentPage > 1
              ? `${baseUrl}?table&page=${currentPage - 1}&limit=${limit}`
              : null,
          next_page_url:
            currentPage < totalPages
              ? `${baseUrl}?table&page=${currentPage + 1}&limit=${limit}`
              : null,
          limit: limit,
          from: start + 1,
          to: end > total ? total : end,
          total: total,
        },
      };
    } catch (error) {
      console.error("Error converting raw data to table:", error);
      throw new Error("Could not convert raw data to table");
    }
  }

  // Custom query for getting a list of records
  async queries(
    rawRequest: Request,
    nameToPath: any = null,
    searchable: any = null,
    withGet: boolean = false
  ): Promise<{
    data: T[];
    meta?: Meta;
  }> {
    try {
      const payload = rawRequest.query;

      // Prepare an empty object for FindOptionsWhere
      let whereConditions: FindOptionsWhere<T> = {};

      // Collect where conditions
      whereConditions = await this.queryLikeWhere(
        whereConditions,
        payload,
        nameToPath
      );
      const inBetweenConditions = await this.queryInBetween(
        whereConditions,
        payload,
        nameToPath
      );

      // Merge inBetweenConditions into whereConditions
      Object.assign(whereConditions, inBetweenConditions);

      // Collect sorting conditions
      const order = await this.queryOrders(payload, nameToPath);

      // Prepare the selected fields based on nameToPath
      const selectedFields = Object.keys(nameToPath).map(
        (key) => nameToPath[key]
      );

      // Fetch the data based on the conditions applied
      const [data, rowCount] = await this.findAll(
        payload,
        whereConditions,
        order,
        searchable,
        selectedFields
      );

      if (withGet) {
        return await this.rawToTable(
          rawRequest,
          data,
          rowCount,
          selectedFields
        );
      }

      return { data };
    } catch (error) {
      console.error("Error performing queries:", error);
      throw new Error("Could not perform queries");
    }
  }

  // Handles like and where conditions
  async queryLikeWhere(
    data: FindOptionsWhere<T> = {}, // Initialize to an empty object
    payload: any,
    nameToPath: { [key: string]: string } | null
  ): Promise<FindOptionsWhere<T>> {
    try {
      // LIKE conditions
      if (payload.like) {
        const likeParams = extractParamsAttribute(payload.like);
        if (likeParams.length > 0) {
          likeParams.forEach(
            (param: { key: string; value: string | string[] }) => {
              const key = escapeString(param.key);
              const fixKey =
                nameToPath && nameToPath[key] ? nameToPath[key] : key;

              // Check if the value is an array or a single string
              if (Array.isArray(param.value)) {
                data[fixKey as keyof T] = In(
                  param.value.map((v) => `%${v}%`)
                ) as any;
              } else {
                data[fixKey as keyof T] = ILike(`%${param.value}%`) as any;
              }
            }
          );
        }
      }

      // WHERE conditions
      if (payload.where) {
        const whereParams = extractParamsAttribute(payload.where);
        if (whereParams.length > 0) {
          whereParams.forEach((param: { key: string; value: any }) => {
            const key = escapeString(param.key);
            const fixKey =
              nameToPath && nameToPath[key] ? nameToPath[key] : key;

            // Convert string 'null' to actual null
            const value = param.value === "null" ? null : param.value;
            data[fixKey as keyof T] = value as any; // Ensure value is correctly typed
          });
        }
      }

      return data;
    } catch (error) {
      console.error("Error performing queryLikeWhere:", error);
      throw new Error("Could not perform queryLikeWhere");
    }
  }

  // Handles in and between conditions
  async queryInBetween(
    data: FindOptionsWhere<T>,
    payload: any,
    nameToPath: { [key: string]: string } | null
  ): Promise<FindOptionsWhere<T>> {
    try {
      // Handle IN condition
      if (payload.in) {
        const inParams = extractParamsAttribute(payload.in);
        inParams.forEach((param) => {
          const key = escapeString(param.key);
          const fixKey = nameToPath && nameToPath[key] ? nameToPath[key] : key;
          if (Array.isArray(param.value)) {
            data[fixKey as keyof T] = In(param.value) as any;
          } else {
            data[fixKey as keyof T] = param.value as any;
          }
        });
      }

      // Handle NOT IN condition
      if (payload.notin) {
        const notInParams = extractParamsAttribute(payload.notin);
        notInParams.forEach((param) => {
          const key = escapeString(param.key);
          const fixKey = nameToPath && nameToPath[key] ? nameToPath[key] : key;
          if (Array.isArray(param.value)) {
            data[fixKey as keyof T] = Not(In(param.value)) as any;
          } else {
            data[fixKey as keyof T] = Not(param.value) as any;
          }
        });
      }

      // Handle BETWEEN condition
      if (payload.between) {
        const betweenParams = parseBetweenQuery(payload.between);

        betweenParams.forEach(({ key, value }) => {
          const [start, end] = value.map((date) => new Date(date));
          const fieldKey =
            nameToPath && nameToPath[key] ? nameToPath[key] : key; // Determine the correct key to use
          data[fieldKey as keyof T] = Between(start, end) as any; // Assign the Between operator
        });
      }

      return data;
    } catch (error) {
      console.error("Error performing queryInBetween:", error);
      throw new Error("Could not perform queryInBetween");
    }
  }

  // Handles order by conditions
  async queryOrders(
    payload: any,
    nameToPath: { [key: string]: string } | null
  ): Promise<FindOptionsOrder<T>> {
    const order: { [K in keyof T]?: "ASC" | "DESC" } = {};

    if (payload.sort) {
      const sortParams = extractParamsAttribute(payload.sort);
      sortParams.forEach((param: KeyValuePair) => {
        const key = escapeString(param.key);
        const fixKey = nameToPath && nameToPath[key] ? nameToPath[key] : key;

        // Determine the sort order
        const sortOrder: "ASC" | "DESC" =
          param.value === "asc" || param.value === "ASC" ? "ASC" : "DESC";

        // Assign the sort order to the order object
        order[fixKey as keyof T] = sortOrder;
      });
    }

    return order as FindOptionsOrder<T>;
  }

  // Handles bulk deletion
  async bulkDestroy(ids: number[]): Promise<boolean> {
    if (!this.repository) {
      throw new Error("Repository not initialized");
    }
    try {
      for (const id of ids) {
        await this.delete(id, true);
      }
      return true;
    } catch (error) {
      console.error("Error performing bulk delete:", error);
      throw new Error("Could not perform bulk delete");
    }
  }

  // Stores notifications
  async storeNotif(payload: any, type: string): Promise<void> {
    // Implement store notification logic here
  }

  // Sends emails
  async email(to: string, subject: string, body: string): Promise<void> {
    // Implement send email logic here
  }

  // Additional helper functions
  // Helper function to finding all with relations
  private async findAllWithRelations(
    rawRequest: any,
    relations: any
  ): Promise<T[]> {
    try {
      if (!this.repository) {
        throw new Error("Repository not initialized");
      }
      const queryBuilder = this.repository.createQueryBuilder();
      if (relations) {
        relations.forEach((relation: string) => {
          queryBuilder.leftJoinAndSelect(relation, relation);
        });
      }
      return await queryBuilder.getMany();
    } catch (error) {
      console.error("Error finding all with relations:", error);
      throw new Error("Could not find all with relations");
    }
  }
}
