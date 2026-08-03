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

        const configData = await fs.readFile(
            configPath,
            "utf-8"
        );

        const config = JSON.parse(configData);

        const commitFolderPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits"
        );

        const folders = await fs.readdir(commitFolderPath);

        const commits = [];

        for (const folder of folders) {

            const commitPath = path.join(
                commitFolderPath,
                folder,
                "commit.json"
            );

            const data = await fs.readFile(
                commitPath,
                "utf-8"
            );

            const commit = JSON.parse(data);

            // Read all files inside this commit
            const commitFiles = await fs.readdir(
                path.join(commitFolderPath, folder)
            );

            const files = [];

            for (const file of commitFiles) {

                if (file === "commit.json") continue;

                const content = await fs.readFile(
                    path.join(commitFolderPath, folder, file),
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

        console.log(commits);

        const response = await axios.post(
            `${config.remoteUrl}/repo/push`,
            {
                repoName: config.repoName,
                commits
            }
        );

        console.log(response.data);

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { pushRepo };