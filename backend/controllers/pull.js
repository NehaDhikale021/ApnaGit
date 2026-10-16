const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function pullRepo() {
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

        console.log("Pulling repository...");

        // Send the authentication token
        const response = await axios.post(
            `${config.remoteUrl}/repo/pull`,
            {
                repoName: config.repoName
            },
            {
                headers: {
                    Authorization: `Bearer ${config.token}`
                },
                timeout: 30000
            }
        );

        const { commits } = response.data;

        if (!Array.isArray(commits)) {
            console.error(
                "Invalid response received from the server."
            );
            return;
        }

        const commitFolderPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits"
        );

        await fs.mkdir(commitFolderPath, {
            recursive: true
        });

        let pulledCount = 0;

        for (const commit of commits) {
            if (
                !commit.id ||
                typeof commit.id !== "string" ||
                !Array.isArray(commit.files)
            ) {
                console.warn(
                    "Skipping an invalid commit received from the server."
                );
                continue;
            }

            const currentCommitPath = path.join(
                commitFolderPath,
                commit.id
            );

            await fs.mkdir(currentCommitPath, {
                recursive: true
            });

            const commitFilePath = path.join(
                currentCommitPath,
                "commit.json"
            );

            await fs.writeFile(
                commitFilePath,
                JSON.stringify(
                    {
                        message: commit.message,
                        date: commit.date
                    },
                    null,
                    2
                )
            );

            for (const file of commit.files) {
                if (
                    typeof file.name !== "string" ||
                    !file.name ||
                    path.basename(file.name) !== file.name ||
                    typeof file.content !== "string"
                ) {
                    console.warn(
                        "Skipping an invalid file in a commit."
                    );
                    continue;
                }

                const filePath = path.join(
                    currentCommitPath,
                    file.name
                );

                await fs.writeFile(
                    filePath,
                    file.content
                );
            }

            pulledCount++;
        }

        console.log(
            `Pull completed. Retrieved ${pulledCount} commit(s).`
        );

    } catch (error) {
        if (error.response) {
            console.error(
                "Pull failed:",
                error.response.data.message ||
                error.response.data.error ||
                `HTTP ${error.response.status}`
            );
        } else {
            console.error("Pull failed:", error.message);
        }
    }
}

module.exports = { pullRepo };