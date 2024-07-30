import app from "./app.js";
import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    AppDataSource.initialize();

    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
