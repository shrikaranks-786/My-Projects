const mongoose = require("mongoose");
const wrapasync = require("../utils/wrapAsync");
const schema = mongoose.Schema;
const Review = require("./review.js");
const user = require("./user.js");
const { string } = require("joi");

const defaultlink = "https://unsplash.com/photos/brown-and-green-temple-near-body-of-water-under-blue-and-white-cloudy-sky-during-daytime-bnMPFPuSCI0";

const listingschema = new schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [ {
        type : schema.Types.ObjectId,
        ref : "review"
    } ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "user"
    },
    filter : String
});


listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing  = mongoose.model("Listing",listingschema);

module.exports = Listing;