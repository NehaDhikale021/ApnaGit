const fs = require("fs").promises;
const path = require("path");

async function initRepo(repoName){
    const repoPath = path.resolve(process.cwd(), "./.apnagit");
    const commitsPath = path.join(repoPath, "commits");
    const stagingPath = path.join(repoPath, "staging");

    try{
        await fs.mkdir(repoPath, {recursive : true});
        await fs.mkdir(commitsPath, {recursive : true});
        await fs.mkdir(stagingPath, { recursive: true });
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify(
            {
                repoName,
                remoteUrl: "http://localhost:5000"
            },
                null,
                2
            )
        );
        console.log("Repository initialised!");
    }catch(err){
        console.error("Error initialising repository", err);
    }
}

module.exports = { initRepo };