const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), "./.apnagit");
    const stagingpath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingpath, { recursive: true });

        console.log("Source:", filePath);

        const content = await fs.readFile(filePath, "utf-8");
        console.log("Original Content:");
        console.log(content);

        const fileName = path.basename(filePath);

        await fs.copyFile(
            filePath,
            path.join(stagingpath, fileName)
        );

        const copied = await fs.readFile(
            path.join(stagingpath, fileName),
            "utf-8"
        );

        console.log("Copied Content:");
        console.log(copied);

        console.log(`File ${fileName} added to the staging area!`);

    } catch (err) {
        console.error(err);
    }
}

module.exports = { addRepo };