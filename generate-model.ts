import * as fs from "fs"; // Use * as fs for CommonJS modules
import * as path from "path"; // Use * as path for CommonJS modules

const modelName = process.argv[2];
const attributes = process.argv[3];

if (!modelName || !attributes) {
  console.error("Usage: ts-node generate-model.ts <ModelName> <attributes>");
  process.exit(1);
}

const templatesPath = path.join(__dirname, "src/templates");
const migrationsPath = path.join(__dirname, "src/migrations");
const modelsPath = path.join(__dirname, "src/models");

const run = async () => {
  try {
    const modelTemplate = fs.readFileSync(
      path.join(templatesPath, "model.ts"),
      "utf-8"
    );
    const migrationTemplate = fs.readFileSync(
      path.join(templatesPath, "migration.ts"),
      "utf-8"
    );

    const modelFileName = path.join(
      modelsPath,
      `${modelName.toLowerCase()}.ts`
    );
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const migrationFileName = path.join(
      migrationsPath,
      `${timestamp}-create-${modelName.toLowerCase()}.ts`
    );

    fs.writeFileSync(
      modelFileName,
      modelTemplate
        .replace(/<%= name %>/g, modelName)
        .replace(/<%= tableName %>/g, `${modelName.toLowerCase()}s`)
    );
    fs.writeFileSync(
      migrationFileName,
      migrationTemplate.replace(
        /<%= tableName %>/g,
        `${modelName.toLowerCase()}s`
      )
    );

    console.log(`Model and migration for ${modelName} generated successfully.`);
  } catch (error) {
    console.error("Error generating model and migration:", error);
  }
};

run();
