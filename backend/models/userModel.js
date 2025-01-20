import db from "../db/database.js";
import bcrypt from "bcryptjs";

// Register a new user
export const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword);
};

// Get user by username
export const getUserByUsername = (username) => {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    return stmt.get(username);
};

// Get user by ID
export const getUserById = (userId) => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(userId);
};
