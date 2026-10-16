const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema({
    commitId: {
        type: String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        required: true
    },
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    },
    files: [
        {
            name:String,
            content: String
        }
    ]
});

module.exports = mongoose.model("Commit", commitSchema);