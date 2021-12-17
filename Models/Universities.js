const mongoose = require("mongoose")
mongoose.Promise = global.Promise;

// Define DB Schema
const universitiesSchema = new mongoose.Schema(
    {
        alpha_two_code: {type:String},
        country: {type:String},
        domain: {type:String},
        name: {type:String},
        web_page: {type:String}
    }
    )
module.exports = mongoose.model("universities", universitiesSchema)
