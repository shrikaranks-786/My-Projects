//changes made
const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const listingdata = await Listing.find({});
    res.render("listings/index.ejs",{alllist : listingdata});
}

module.exports.RendernewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist's");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist's");
        res.redirect("/listings");
    }
    let orginal_img = listing.image.url;
    res.render("listings/edit.ejs",{listing,orginal_img});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let lisiting = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        lisiting.image = {url,filename};
        await lisiting.save();
    }

    req.flash("success","Listing Update!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

module.exports.searchlisting = async (req,res)=>{
    let destination = req.body.searchL;
    let lisitings = await Listing.find({country : destination});
    res.render("listings/index.ejs",{alllist : lisitings});
}