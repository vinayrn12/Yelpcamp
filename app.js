var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    localStrategy   = require("passport-local"),
    passport        = require("passport"),
    // Campground      = require("./models/campground"),
    // seedDB          = require("./seeds"),
    // Comment         = require("./models/comment"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    User            = require("./models/user");

var campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments"),
    indexRoutes             = require("./routes/index");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //seed the DB

//PASSPORT CONFIGURATION
//======================
app.use(require("express-session")({
    secret: "I am a god",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 12345;
app.listen(port, function(){
    console.log("The Yelpcamp server is listening...");
});
