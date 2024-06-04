const express = require("express");
const router = express.Router({mergeParams : true});
const wrapasync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const {validatereview , isLoggedin, isReviewauthor} = require("../middleware.js");
const Reviewcontroller = require("../controller/review.js");

//create revie
router.post("/",isLoggedin,validatereview,wrapasync(Reviewcontroller.createReview));

router.delete("/:reviewid",isLoggedin,isReviewauthor,wrapasync(Reviewcontroller.deleteReview));

module.exports = router;