"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } =
  process.env;

if (!DB_DIALECT) {
  throw new Error("Dialect needs to be explicitly supplied as of v4.0.0");
}

// Create the Sequelize instance
const sequelize = new Sequelize(
  DB_NAME || "FREEPDB1",
  DB_USER || "root",
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: parseInt(DB_PORT as string, 10),
    dialect: DB_DIALECT as "mysql" | "oracle" | "postgres" | "sqlite",
  }
);

// Define an interface for models that includes the associate method
interface ModelWithAssociations extends Model {
  associate?: (models: DbModels) => void; // Optional associate method
}

// Extend the ModelStatic to include the associate method
interface ModelStaticWithAssociations
  extends ModelStatic<ModelWithAssociations> {
  associate?: (models: DbModels) => void; // Optional associate method
}

// Define an interface for the models in the db
interface DbModels {
  [key: string]: ModelStaticWithAssociations; // Use the new ModelStaticWithAssociations type
}

// Define a separate interface for the database object
interface Database {
  sequelize: Sequelize; // Explicitly declare sequelize as a property
  Sequelize: typeof Sequelize; // Explicitly declare Sequelize as a property
  models: DbModels; // Store models separately
}

// Initialize the db object
const db: Database = {
  sequelize,
  Sequelize, // Assign the Sequelize constructor
  models: {}, // Initialize an empty object for models
};

// Read and import models
const importModels = async () => {
  const basename = path.basename(__filename);

  const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of modelFiles) {
    const model = (await import(path.join(__dirname, file))).default(
      db.sequelize,
      DataTypes
    ) as ModelStaticWithAssociations;
    db.models[model.name] = model;
  }

  // Set up associations
  Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
      db.models[modelName].associate(db.models);
    }
  });
};

// Execute model import
importModels().catch((error) => {
  console.error("Error importing models:", error);
});

export default db; // Export the db object containing the sequelize instance and models
