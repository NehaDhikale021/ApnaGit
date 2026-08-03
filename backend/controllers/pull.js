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

        console.log(response.data);

    } catch (error) {

        console.log(error.message);

    }

}

module.exports = { pullRepo };