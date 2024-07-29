import { Sequelize } from "sequelize-typescript";
import config from "./src/config/config.js"; // Ensure the correct import
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the valid environment keys
type Environment = keyof typeof config;

// Get the environment variable, falling back to 'development' if it's not set
const environment: Environment =
  (process.env.NODE_ENV as Environment) || "development";
const dbConfig = config[environment]; // Use the config based on the environment

console.log(`Running in ${environment} mode`); // Log the current environment

const sequelize = new Sequelize({
  ...dbConfig,
  models: [join(__dirname, "src/models/**/*.ts")],
});

const runMigrations = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

runMigrations();
