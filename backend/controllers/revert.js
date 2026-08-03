const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitID) {
    try{
        const commitPath = path.join(
            process.cwd(),
            ".apnagit",
            "commits",
            commitID
        );
        console.log(commitPath);

        const files = await fs.readdir(commitPath);
        
         for (const file of files) {

            if (file === "commit.json") {
                continue;
            }

            const sourcePath = path.join(
                commitPath,
                file
            );

            const destinationPath = path.join(
                process.cwd(),
                file
            );

            await fs.copyFile(
                sourcePath,
                destinationPath
            );

            console.log(`${file} restored`);
        }

        console.log("Revert completed successfully!");

        
    }catch(err){
        console.log(err.message);
    }
}

module.exports = { revertRepo };