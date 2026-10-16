const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const repoRoutes = require("./routes/repoRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/repo", repoRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("🚀 ApnaGit Server is Running");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});