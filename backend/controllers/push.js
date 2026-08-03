
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function pushRepo(){
    try{
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

        console.log(config);

        const commitFolderPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits"
        );
        const folders = await fs.readdir(commitFolderPath);
        console.log(folders);

        const commits = [];
        for(const folder of folders){
            console.log(folder);

            const commitPath = path.join(
                commitFolderPath,
                folder,
                "commit.json",
            )

            console.log(commitPath);

            const data = await fs.readFile(
                commitPath,
                "utf-8",
            );

            const commit = JSON.parse(data);
            commits.push({
                id : folder,
                ...commit
            });
        }
        console.log(commits);

        const response = await axios.post(
            `${config.remoteUrl}/repo/push`,
            {
            repoName: config.repoName,
            commits,
            }
        );

        console.log(response.data);
    }catch(error){
        console.log(error.message);
    }
}

module.exports = { pushRepo };