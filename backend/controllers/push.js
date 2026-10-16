const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function pushRepo() {
    try {
        const configPath = path.join(
            process.cwd(),
            ".apnagit",
            "config.json"
        );

        const config = JSON.parse(
            await fs.readFile(configPath, "utf-8")
        );

        // Validate configuration
        if (!config.remoteUrl || !config.repoName || !config.token) {
            console.error(
                "Missing remote URL, repository name, or authentication token."
            );
            return;
        }

        const commitFolderPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits"
        );

        const folders = await fs.readdir(commitFolderPath);

        if (folders.length === 0) {
            console.log("No commits available to push.");
            return;
        }

        const commits = [];

        for (const folder of folders) {
            const currentCommitPath = path.join(
                commitFolderPath,
                folder
            );

            const commitFilePath = path.join(
                currentCommitPath,
                "commit.json"
            );

            const commitData = await fs.readFile(
                commitFilePath,
                "utf-8"
            );

            const commit = JSON.parse(commitData);

            const commitFiles = await fs.readdir(
                currentCommitPath
            );

            const files = [];

            for (const file of commitFiles) {
                if (file === "commit.json") {
                    continue;
                }

                const filePath = path.join(
                    currentCommitPath,
                    file
                );

                const content = await fs.readFile(
                    filePath,
                    "utf-8"
                );

                files.push({
                    name: file,
                    content
                });
            }

            commits.push({
                id: folder,
                ...commit,
                files
            });
        }

        console.log(`Pushing ${commits.length} commit(s)...`);

        const response = await axios.post(
            `${config.remoteUrl}/repo/push`,
            {
                repoName: config.repoName,
                commits
            },
            {
                headers: {
                    Authorization: `Bearer ${config.token}`
                },
                timeout: 30000
            }
        );

        console.log(
            response.data.message || "Push completed successfully."
        );

    } catch (error) {
        if (error.response) {
            console.error(
                "Push failed:",
                error.response.data.message ||
                error.response.data.error ||
                `HTTP ${error.response.status}`
            );
        } else if (error.code === "ENOENT") {
            console.error(
                "Repository or commit directory not found. Initialize the repository and create a commit first."
            );
        } else {
            console.error("Push failed:", error.message);
        }
    }
}

module.exports = { pushRepo };