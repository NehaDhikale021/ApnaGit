const { default: inquirer } = require("inquirer");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function loginUser(){
    const credentials = await inquirer.prompt([
        {
            type:"input",
            name:"email",
            message:"Enter you email:"
        },
        {
            type: "password",
            name:"password",
            message:"Enter your password:"
        }
    ]);
    try{    
        const response = await axios.post(
            "http://localhost:5000/auth/login",
            credentials
        );

        const configPath = path.join(
            process.cwd(),
            ".apnagit",
            "config.json"
        );
        
        const config = {
            remoteUrl: "http://localhost:5000",
            repoName: "netflix",
            token:response.data.token
        };

        await fs.writeFile(
            configPath,
            JSON.stringify(config,null,2)
        );

        console.log("login Succesfull!!");
        console.log("Token Saved!!");
    }catch(err){
        console.log(err.response?.data || err.message);
    }
}

module.exports = {
    loginUser
};