import app from "./app.js";
import "reflect-metadata";
import { OracleDataSourceAuth } from "./services/database/oracle/data-source.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    OracleDataSourceAuth.initialize();

    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
