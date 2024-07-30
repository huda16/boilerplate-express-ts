import app from "./app.js";
import "reflect-metadata";
import { OracleDataSourceAuth } from "./services/database/oracle/authDataSource.js";

const HOST = process.env.APP_HOST || 'http://localhost';
const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  try {
    OracleDataSourceAuth.initialize();

    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
