const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
            unique:true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("Repository", repositorySchema);