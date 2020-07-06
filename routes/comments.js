var express		=	require('express');
var router		=	express.Router({mergeParams : true});
var Campground	=	require("../models/campground");
var Comment		=   require("../models/comment");
var middleware  =   require("../middleware");

//new comments route
router.get("/new",middleware.isLoggedIn,function(req,res){
		//find cmapground by id
		Campground.findById(req.params.id,function(err,campground){
			if(err)
				{
					req.flash("error","Campground not found!");
					console.log(err);
				}
			else
				{
				 res.render("comments/new",{campground:campground});
				}
				
		});
	});
//Create comments route
router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground using id
	Campground.findById(req.params.id,function(err,campground){
			if(err)
				{
					console.log(err);
					req.flash("error","Campground not found!");
					res.redirect("/campgrounds");
				}
			else
				{
					//create a new comment and save to database
					Comment.create(req.body.comment,function(err,comment){
						if(err)
							{
								req.flash("error","Something went wrong!")
								console.log(err);
								
							}
						else
							{
								//add username and id to comment
								comment.author.id = req.user._id;
								comment.author.username=req.user.username;
								//save comment
								comment.save();
								//link comment to campground
								campground.comments.push(comment);
								campground.save();
							    //redirect back to campgrounds
								req.flash("success","Successfully added Comment!");
								res.redirect("/campgrounds/"+campground._id);	
							}
					});
				}
				
		});
	});
//EDIT COMMENTS ROUTE
	router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	   Comment.findById(req.params.comment_id, function(err, foundComment){
			  if(err)
			  {
				  console.log(err);
				  req.flash("error","Comment not found");
				  res.redirect("back");
			  }
			  else
			  {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			  }
	   });
});

//UPDATE COMMENTS ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
		if(err)
			{
				req.flash("error","Comment not found");
				res.redirect("back");
			}
		else
			{
				res.redirect("/campgrounds/"+req.params.id);
			}
	});
});

//DESTROY COMMENTS ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
		{
			req.flash("error","Comment not found");
			res.redirect("back");
			console.log(err);
		}
		else
		{
			req.flash("success","Comment Deleted!");
			res.redirect("/campgrounds/"+req.params.id);
		}
		
	});
});

module.exports = router;
	