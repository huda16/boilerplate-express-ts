import app from "./app";
import "reflect-metadata";
import { OracleDataSource } from "./services/database/oracle/dataSource";

const HOST = process.env.APP_HOST || 'http://localhost';
const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  try {
    OracleDataSource.initialize();

    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
