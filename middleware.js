const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const expressError = require("./utils/expressError.js");
const { listingschema } = require("./schema.js");
const {reviewschema } = require("./schema.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to do the following task!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let lisiting = await Listing.findById(id);
    if(!lisiting.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewauthor = async(req,res,next)=>{
    let {id , reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting = (req,res,next)=>{
    console.log(req.body);
    let {error} = listingschema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errmsg);
    }
    else{
        next();
    }
}