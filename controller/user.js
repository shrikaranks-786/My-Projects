const user = require("../models/user.js");

module.exports.Rendersignup = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.Signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new user({
            email,username
        });
        const ruser = await user.register(newuser,password);
        console.log(ruser);
        req.login(ruser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.Renderlogin = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been loged out!");
        res.redirect("/listings");
    })
}