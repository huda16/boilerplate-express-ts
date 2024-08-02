import app from "./app";
import "reflect-metadata";
import { OracleDataSource } from "./services/database/oracle/dataSource";

const HOST = process.env.APP_HOST || "http://localhost";
const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  try {
    // Initialize the database
    await OracleDataSource.initialize();
    console.log("Data Source has been initialized!");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Received shutdown signal, closing database connection...");

  try {
    await OracleDataSource.destroy();
    console.log("Database connection closed.");
    process.exit(0); // Exit the process with a success code
  } catch (error) {
    console.error("Error closing the database connection:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// Handle shutdown signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();
