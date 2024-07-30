# Boilerplate Express TypeScript

A boilerplate project for building RESTful APIs with Express.js and TypeScript, utilizing Sequelize for database interactions with OracleDB.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Linting](#linting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Built with Express.js and TypeScript
- Sequelize ORM for database interactions
- OracleDB support
- Environment variable management using dotenv
- ESLint for code linting
- Nodemon for development

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- OracleDB (if applicable)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/boilerplate-express-ts.git
   cd boilerplate-express-ts

2. Install the dependencies
   ```bash
    npm install

3. Create a .env file in the root directory and add your environment variables:
   ```bash
    APP_HOST=http://localhost
    APP_PORT=3000

    DB_HOST=127.0.0.1
    DB_PORT=1539
    DB_USERNAME_AUTH=auth
    DB_PASSWORD_AUTH=root
    DB_USERNAME_MASTER_DATA=master_data
    DB_PASSWORD_MASTER_DATA=root
    DB_USERNAME_INVENTORY=inventory
    DB_PASSWORD_INVENTORY=root
    DB_USERNAME_TRANSACTION=transaction
    DB_PASSWORD_TRANSACTION=root
    DB_SID=FREEPDB1

## Create File Migration using Entity
   ```bash
    npm run typeorm migration:generate ./src/migration/name-file -- -d ./src/services/database/oracle/data-source-file.ts

## Usage
To start the development server, run:
   ```bash
    npm run dev

## Script
   ```bash
    npm run dev: Start the development server with Nodemon.
    npm run build: Compile TypeScript to JavaScript.
    npm run lint: Lint the project files using ESLint.

## Linting
   ```bash
    To ensure code quality, you can lint your files using:
    npm run lint

## Contributing
Contributions are welcome! Please feel free to submit a pull request or create an issue if you have suggestions or improvements.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

### Customization

- **Project Name and Description:** Update the title and description to match your project's specifics.
- **Features:** List the main features of your project.
- **Prerequisites:** Specify any prerequisites that users need before running your project.
- **Installation:** Provide clear instructions for installing and setting up the project.
- **Usage:** Include details on how to use the project, including starting the server and any relevant endpoints.
- **Scripts:** List available npm scripts and their functions.
- **Contributing:** Mention how others can contribute to your project.
- **License:** Specify the license under which your project is distributed.

### Adding the `README.md` File

1. Create a file named `README.md` in the root of your project directory.
2. Copy and paste the above content into your `README.md` file.
3. Customize the content as needed.
4. Save the file.

### Committing Changes

After adding the `README.md` file, make sure to commit it to your repository:

```bash
git add README.md
git commit -m "Add README.md file"
