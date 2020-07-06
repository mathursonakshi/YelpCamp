	var express     		 =  require('express'),
	app         			 =  express(),
    bodyParser  			 =  require("body-parser"),
	passport    			 =  require("passport"),
    mongoose    			 =  require("mongoose"),
	flash					 =	require("connect-flash"),
	Campground				 =	require("./models/campground"),
	seedDB					 =	require("./seeds"),
	User         			 =  require("./models/user"),
	methodOverride 			 =  require("method-override"),
	LocalStrategy			 =  require("passport-local"),
	passportLocalMongoose 	 =  require("passport-local-mongoose"),
	Comment		 			 =  require("./models/comment");

//adding route files
var commentRoutes		=	require("./routes/comments"),
	campgroundRoutes	=	require("./routes/campgrounds"),
	indexRoutes			=	require("./routes/index");

//conencting to mongo db
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology',true);
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://sonakshi:Abrini123!@cluster0.2uwot.mongodb.net/<dbname>?retryWrites=true&w=majority")

//setting up body parser
app.use(bodyParser.urlencoded({extended:true}));

//setting up ejs as viewing engine
app.set("view engine","ejs");

//find assets like external stylesheets in public library
app.use(express.static(__dirname+"/public"));

//setting up method overridapp.use(methodOverride("_method"));
app.use(methodOverride("_method"));

//setting up flash for error messages
app.use(flash());

//seeding the database
//seedDB();
//moment js setup
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Abrini",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that will run for every single route
app.use(function(req,res,next){
	res.locals.currentUser=	req.user;
	res.locals.error	  =	req.flash("error");
	res.locals.success	  =	req.flash("success");
	next();
});

//using routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//setting server to listen on port 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Yelp Camp Server has started!!!");
});