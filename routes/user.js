const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");
const { route } = require("./listing");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");


router.route("/signup")
.get(usercontroller.Rendersignup)
.post(wrapasync(usercontroller.Signup));

router.route("/login")
.get(usercontroller.Renderlogin)
.post(saveUrl,passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}),
usercontroller.login)

router.get("/logout",usercontroller.logout);

module.exports = router;