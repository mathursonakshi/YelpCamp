var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

//check if user is logged in and owns the campground before edit or delete
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
			   req.flash("error","Campground not found!");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error","You don't have permission to do that!");
                res.redirect("back");
            }
           }
        });
    } else{
		req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}
//check if user is logged in and owns the commnet before edit or delete
middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
			   req.flash("error","Comment not found!");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error","You don't have permission to do that!");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

//check if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	//adding flash error message when a user needs to login
	req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;