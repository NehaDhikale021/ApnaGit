const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
.command("init", "Initialize a new repository", {}, initRepo )
.command(
    "add <file>", 
    "Add repo to staging area", 
    (yargs) => {
        yargs.positional("file", {
            describe: "file adding to the staging area",
            type: "String",
        });
    }, 
    (argv) => {
        addRepo(argv.file);
    }
) 
.command(
    "commit <message>", 
    "Commit the staged messages", 
    (yargs) => {
        yargs.positional("message", {
            describe: "commit the message",
            type: "String",
        });
    }, 
    commitRepo )
.command("push", "push commands to S3", {}, pushRepo )
.command("pull", "pull commands from S3", {}, pullRepo )
.command(
    "revert <commitID>", 
    "Revert to a specific commit", 
    (yargs) => {
        yargs.positional("commitID", {
            describe: "commit ID to revert to",
            type: "String",
        });
    }, 
    revertRepo )
.demandCommand(1, "you need at least one command")
.help().argv;


