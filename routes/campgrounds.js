var express=require("express"),
router=express.Router({mergeParams:true}),
Campground=require("../models/campground"),
Comment=require("../models/comment"),
middleware=require("../middleware")
router.get("/",(req,res)=>{
    Campground.find({},(err, allCampgrounds)=>{
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{
              campgrounds:allCampgrounds,
              currentUser:req.user
            });
       }
    });
})
//CREATE
router.post("/",middleware.isLoggedIn,(req,res)=>{
	let name=req.body.name;
	let image=req.body.image;
    let location=req.body.location;
    let price=req.body.price;
    let desc=req.body.description;
    let author={
        id:req.user._id,
        username:req.user.username
    };
	let newCamp={
        name:name,
        image:image,
        location:location,
        price:price,
        description:desc,
        author:author
    };
	Campground.create(newCamp,(err,newcampground)=>{
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});

});
//New- display form to create campground
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new");
});
//Show- show one instance of the route
router.get("/:id",middleware.isLoggedIn, (req, res)=>{
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err||!foundCampground){
            req.flash('error','Campground not found');
            res.redirect('back');
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//Edit Campground
router.get('/:id/edit',middleware.campgroundOwner,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }

    });
});
//Update Campground
router.put('/:id',middleware.campgroundOwner,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if (err) {
            res.redirect('/campgrounds');
        }
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});
//Destroy Campground Route
router.delete('/:id',middleware.campgroundOwner,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err,campgroundRemoved)=>{
        if(err){
            res.redirect("/campgrounds");
        }
        Comment.deleteMany({
            _id:{
                $in: campgroundRemoved.comments
            }
        },(err)=>{
            if (err) {
                console.log(err);
            }
            res.redirect('/campgrounds');
        });
    });
});
module.exports=router;