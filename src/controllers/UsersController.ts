import { Request, Response } from "express";
import UsersRepository from "../repositories/auth/UsersRepository"; // Adjust the import path based on your project structure

class UsersController {
  // Create a new user
  async createUser(req: Request, res: Response) {
    try {
      const user = await UsersRepository.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UsersRepository.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a user by ID
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UsersRepository.findById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a user by ID
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await UsersRepository.update(Number(id), req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a user by ID
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleted = await UsersRepository.delete(Number(id));
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(204).send(); // No content
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new UsersController();
