const { string, required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportlocalMongoose = require("passport-local-mongoose");

const userschema = new schema({
    email : {
        type : String,
        required : true,
    }
})

userschema.plugin(passportlocalMongoose);

module.exports = mongoose.model("user",userschema);