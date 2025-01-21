import db from "../db/database.js";
import bcrypt from "bcryptjs";

class UserModel {
    // Register a new user
    static async createUser(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const stmt = await db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            await stmt.run(username, hashedPassword);
            await stmt.finalize(); // Close the statement
        } catch (error) {
            throw new Error("Error creating user: " + error.message);
        }
    }

    // Get user by username
    static async getUserByUsername(username) {
        try {
            const stmt = await db.prepare("SELECT * FROM users WHERE username = ?");
            const user = await stmt.get(username);
            await stmt.finalize(); // Close the statement
            return user;
        } catch (error) {
            throw new Error("Error retrieving user: " + error.message);
        }
    }

    // Get user by ID
    static async getUserById(userId) {
        try {
            const stmt = await db.prepare("SELECT * FROM users WHERE id = ?");
            const user = await stmt.get(userId);
            await stmt.finalize(); // Close the statement
            return user;
        } catch (error) {
            throw new Error("Error retrieving user by ID: " + error.message);
        }
    }
}

export default UserModel;
