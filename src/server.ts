import app from "./app.js";
import { sequelize } from "./models/index.js"; // Assuming you will set up Sequelize in models/index.ts

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test DB connection
    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
