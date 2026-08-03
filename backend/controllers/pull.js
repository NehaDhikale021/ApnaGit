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

        const response = await axios.post(
            `${config.remoteUrl}/repo/pull`,
            {
                repoName: config.repoName
            }
        );

        const { commits } = response.data;
        console.log(commits);

        const commitFolderPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits"
        );

        await fs.mkdir(commitFolderPath, {recursive:true});

        for(const commit of commits){

            const currentCommitPath = path.join(
                commitFolderPath,
                commit.id
            );

            await fs.mkdir(currentCommitPath, {recursive:true});

            const commitFilePath = path.join(
                currentCommitPath,
                "commit.json"
            );

            await fs.writeFile(
                commitFilePath,
                JSON.stringify({
                    message:commit.message,
                    date:commit.date
                })
            );
            for (const file of commit.files) {
                await fs.writeFile(
                path.join(currentCommitPath, file.name),
                file.content
                );
            }
        }

    } catch (error) {

        console.log(error.message);

    }

}

module.exports = { pullRepo };