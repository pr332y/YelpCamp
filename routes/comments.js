var express=require("express"),
router=express.Router({mergeParams:true}),
Campground=require("../models/campground"),
Comment=require("../models/comment"),
middleware=require("../middleware")
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err||!campground){
            req.flash('error',"Campground not found");
            res.redirect('back');
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});
router.post('/',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    req.flash("error","Something went wrong. Please try again later");
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    })
});
router.get('/:comment_id/edit',middleware.commentOwner,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if (err||!foundCampground) {
            req.flash("error","Campground not found")
            return res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if (err) {
                    res.redirect("back");
                }else{
                    res.render("comments/edit",{
                        campground_id:req.params.id,
                        comment: foundComment
                    });
                }
            });
        }
    })

});
router.put("/:comment_id",middleware.commentOwner,(req,res)=>{
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
       if (err) {
           res.redirect("back");
       }else{
           res.redirect(`/campgrounds/${req.params.id}`);
       }
   });
});
router.delete("/:comment_id",middleware.commentOwner,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports=router;