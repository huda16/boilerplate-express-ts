import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  createdAt?: Date; // Optional, as it might be set automatically
  updatedAt?: Date; // Optional, as it might be set automatically
}

// Define the creation attributes for the User model
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// @ts-ignore
class <%= name %> extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
<%= name %>.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: '<%= tableName %>',
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

export default <%= name %>;
