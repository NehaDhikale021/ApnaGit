
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==================== REGISTER USER ====================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate input types
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email, and password must be strings"
            });
        }

        // Normalize input
        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Validate name
        if (!trimmedName) {
            return res.status(400).json({
                message: "Name cannot be empty"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        // Check whether user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name: trimmedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        // Send only safe user information
        return res.status(201).json({
            message: "User registered successfully",
            newUser: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        // Handle duplicate email race conditions
        if (err.code === 11000) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        console.error("Registration error:", err);

        return res.status(500).json({
            message: "An internal server error occurred"
        });
    }
};


// ==================== LOGIN USER ====================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Validate input types
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Validate JWT configuration
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                message: "Authentication service is not configured"
            });
        }

        // Find user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: existingUser._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Return token and safe user information
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);

        return res.status(500).json({
            message: "An internal server error occurred"
        });
    }
};


// ==================== EXPORT CONTROLLERS ====================

module.exports = {
    registerUser,
    loginUser
};

