if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.secret);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const expressError = require("./utils/expressError.js");
const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const user = require("./models/user.js");
const bodyParser = require('body-parser');

const dburl = process.env.ATLAS_URL;

main().then(()=>{
    console.log("connected to wanderlust");
})
.catch(()=>{
    console.log("not connected");
});

async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine","ejs")
app.set("views,",path.join(__dirname,"views"));
app.use(bodyParser.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600
})

store.on("error",(err)=>{
    console.log("error in mongo session store",err);
})

const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);


app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found"));
});



app.use((err,req,res,next)=>{
    let {statuscode = 500 , message = "Something went wrong!"} = err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
});



app.listen("3000",()=>{
    console.log("server is listning to port 3000");
});

