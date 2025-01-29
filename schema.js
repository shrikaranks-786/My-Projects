const joi = require("joi")
const listing = require("./models/listing");
const review = require("./models/review");
const { json } = require("express");

module.exports.listingschema =  joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().allow("",null),
        filter : joi.string().required()
    }).required()
})

module.exports.reviewschema = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required()
})
