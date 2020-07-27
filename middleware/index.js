let middlewareObj={},
Campground=require("../models/campground"),
Comment=require("../models/comment"),
flash=require("connect-flash");
middlewareObj.campgroundOwner=function (req,res,next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id,(err,foundCampground)=>{
            if (err||!foundCampground) {
                req.flash("error","Campground not found");
                res.redirect('back');
            }else{
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "You don't have the required permissions");
                    res.redirect('back');
                }
            }
        });        
    } else {
        res.redirect("/login");
    }
}
middlewareObj.commentOwner=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,(err,foundComment)=>{
            if (err||!foundComment){
                req.flash('error','Comment not found');
                res.redirect("/campgrounds");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error','Access Denied');
                    res.redirect('back');
                }
            }
        });
    }
}
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Access Denied");
    res.redirect("/login");
}
module.exports=middlewareObj;