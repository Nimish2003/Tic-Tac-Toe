import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
// console.log(SECRET_KEY);


class AuthController {
    async register(req, res) {
        try {
            console.log("Register Request:", req.body);

            const { username, password } = req.body;
            await UserModel.createUser(username, password);

            console.log(`User registered: ${username}`);
            res.status(201).json({ message: "User registered successfully!" });

        } catch (err) {
            console.error("Registration Error:", err);
            res.status(400).json({ error: "Username already exists" });
        }
    }

    async login(req, res) {
        try {
            console.log("Login Request:", req.body);

            const { username, password } = req.body;
            const user = await UserModel.getUserByUsername(username); 

            if (!user || !(await bcrypt.compare(password, user.password))) {
                console.warn(`Invalid login attempt for username: ${username}`);
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

            console.log(`Login successful: ${username} | Token: ${token.substring(0, 10)}...`);
            res.json({ token });

        } catch (err) {
            console.error("Login Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default new AuthController();
