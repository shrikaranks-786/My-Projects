const express = require("express");
const app = express();
const router = express.Router();
const wrapasync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin , isOwner , validatelisting} = require("../middleware.js");
const Listingcontroller = require("../controller/listing.js");
const multer  = require('multer');
const storage = require("../cloudconfig.js")
const upload = multer({storage});




//all listings
//cretaeListing
router
.route("/")
.get(wrapasync(Listingcontroller.index))
.post(isLoggedin,upload.single('listing[image]'),validatelisting,wrapasync(Listingcontroller.createListing));



//new listing
router.get("/new",isLoggedin,Listingcontroller.RendernewForm);


//icons
router.get("/icons/:id",async(req,res)=>{
    let {id} = req.params;
    if(id==="trending" || id==="rooms"){
        let rooms1 = await Listing.find({});
        res.render("listings/index.ejs",{alllist : rooms1});
    }
    else{
        let rooms2 = await Listing.find({filter : id});
        res.render("listings/index.ejs",{alllist : rooms2});
    }
})

//show listings
//update lisiting
//delete listing
router.route("/:id")
.get(wrapasync(Listingcontroller.showListings))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validatelisting,wrapasync(Listingcontroller.updateListing))
.delete(isLoggedin,isOwner,wrapasync(Listingcontroller.deleteListing));

//edit listing
router.get("/:id/edit",isLoggedin,isOwner,wrapasync(Listingcontroller.editListing));

//searchb
router.post("/slisting",wrapasync(Listingcontroller.searchlisting));




module.exports = router;