const fs = require("fs").promises;
const path = require("path");

const Repository = require("../models/Repository");
const Commit = require("../models/commit");

const REPOSITORIES_DIR = path.join(__dirname, "..", "repositories");

// Validate repository name
const isValidRepoName = (repoName) => {
    return (
        typeof repoName === "string" &&
        /^[a-zA-Z0-9_-][a-zA-Z0-9._-]*$/.test(repoName) &&
        repoName.length <= 100 &&
        repoName !== "." &&
        repoName !== ".."
    );
};

// ==================== CREATE REPOSITORY ====================

const createRepo = async (req, res) => {
    try {
        const { repoName } = req.body;

        if (!isValidRepoName(repoName)) {
            return res.status(400).json({
                message: "Please provide a valid repository name"
            });
        }

        const existingRepo = await Repository.findOne({
            name: repoName
        });

        if (existingRepo) {
            return res.status(409).json({
                message: "Repository already exists"
            });
        }

        const repoPath = path.join(
            REPOSITORIES_DIR,
            repoName
        );

        await fs.mkdir(
            path.join(repoPath, "commits"),
            { recursive: true }
        );

        await Repository.create({
            name: repoName
        });

        return res.status(201).json({
            message: "Repository created successfully",
            repository: repoName
        });

    } catch (error) {
        console.error("Create repository error:", error.message);

        return res.status(500).json({
            message: "Failed to create repository"
        });
    }
};

// ==================== PUSH REPOSITORY ====================

const pushRepo = async (req, res) => {
    try {
        const { repoName, commits } = req.body;

        if (!isValidRepoName(repoName)) {
            return res.status(400).json({
                message: "Please provide a valid repository name"
            });
        }

        if (!Array.isArray(commits)) {
            return res.status(400).json({
                message: "Commits must be provided as an array"
            });
        }

        let repository = await Repository.findOne({
            name: repoName
        });

        if (!repository) {
            repository = await Repository.create({
                name: repoName
            });
        }

        const commitsPath = path.join(
            REPOSITORIES_DIR,
            repoName,
            "commits"
        );

        await fs.mkdir(commitsPath, {
            recursive: true
        });

        let newCommits = 0;

        for (const commit of commits) {
            if (
                !commit ||
                typeof commit.id !== "string" ||
                !/^[a-zA-Z0-9_-]+$/.test(commit.id) ||
                typeof commit.message !== "string" ||
                !Array.isArray(commit.files)
            ) {
                return res.status(400).json({
                    message: "Invalid commit data received"
                });
            }

            const commitDate = commit.date
                ? new Date(commit.date)
                : new Date();

            if (Number.isNaN(commitDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid commit date"
                });
            }

            // Validate file data before writing.
            for (const file of commit.files) {
                if (
                    !file ||
                    typeof file.name !== "string" ||
                    file.name.length === 0 ||
                    path.basename(file.name) !== file.name ||
                    file.name === "." ||
                    file.name === ".." ||
                    typeof file.content !== "string"
                ) {
                    return res.status(400).json({
                        message: "Invalid file data in commit"
                    });
                }
            }

            const commitFolderPath = path.join(
                commitsPath,
                commit.id
            );

            await fs.mkdir(commitFolderPath, {
                recursive: true
            });

            await fs.writeFile(
                path.join(commitFolderPath, "commit.json"),
                JSON.stringify(
                    {
                        ...commit,
                        date: commitDate
                    },
                    null,
                    2
                )
            );

            for (const file of commit.files) {
                await fs.writeFile(
                    path.join(commitFolderPath, file.name),
                    file.content
                );
            }

            // Update an existing commit or create a new one.
            const existingCommit = await Commit.findOne({
                commitId: commit.id,
                repository: repository._id
            });

            await Commit.findOneAndUpdate(
                {
                    commitId: commit.id,
                    repository: repository._id
                },
                {
                    $set: {
                        commitId: commit.id,
                        message: commit.message,
                        date: commitDate,
                        repository: repository._id,
                        files: commit.files
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );

            if (!existingCommit) {
                newCommits++;
            }
        }

        return res.status(200).json({
            message: "Push completed successfully",
            repository: repoName,
            received: commits.length,
            newCommits
        });

    } catch (error) {
        console.error("Push repository error:", error.message);

        return res.status(500).json({
            message: "Failed to push repository"
        });
    }
};

// ==================== PULL REPOSITORY ====================

const pullRepo = async (req, res) => {
    try {
        const { repoName } = req.body;

        if (!isValidRepoName(repoName)) {
            return res.status(400).json({
                message: "Please provide a valid repository name"
            });
        }

        const repository = await Repository.findOne({
            name: repoName
        });

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        const commitsPath = path.join(
            REPOSITORIES_DIR,
            repoName,
            "commits"
        );

        await fs.mkdir(commitsPath, {
            recursive: true
        });

        const folders = await fs.readdir(commitsPath, {
            withFileTypes: true
        });

        const commits = [];

        for (const folder of folders) {
            if (!folder.isDirectory()) {
                continue;
            }

            const commitId = folder.name;

            if (!/^[a-zA-Z0-9_-]+$/.test(commitId)) {
                continue;
            }

            const commitFolderPath = path.join(
                commitsPath,
                commitId
            );

            const commitFilePath = path.join(
                commitFolderPath,
                "commit.json"
            );

            let commitData;

            try {
                commitData = JSON.parse(
                    await fs.readFile(commitFilePath, "utf-8")
                );
            } catch (error) {
                console.error(
                    "Unable to read commit:",
                    commitId,
                    error.message
                );
                continue;
            }

            const entries = await fs.readdir(
                commitFolderPath,
                { withFileTypes: true }
            );

            const files = [];

            for (const entry of entries) {
                if (
                    !entry.isFile() ||
                    entry.name === "commit.json"
                ) {
                    continue;
                }

                const content = await fs.readFile(
                    path.join(commitFolderPath, entry.name),
                    "utf-8"
                );

                files.push({
                    name: entry.name,
                    content
                });
            }

            commits.push({
                ...commitData,
                id: commitId,
                files
            });
        }

        return res.status(200).json({
            message: "Pull completed successfully",
            repoName,
            commits
        });

    } catch (error) {
        console.error("Pull repository error:", error.message);

        return res.status(500).json({
            message: "Failed to pull repository"
        });
    }
};

module.exports = {
    createRepo,
    pushRepo,
    pullRepo
};