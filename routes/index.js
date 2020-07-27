var express=require("express"),
router=express.Router({mergeParams:true}),
passport=require('passport'),
connectEnsureLogin = require('connect-ensure-login'),
User=require('../models/user')
router.get("/", (req,res)=>{
	res.render("landing");
});
router.get('/register',(req,res)=>{
    res.render('register');
});
router.post('/register',(req,res)=>{
    let newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req,res,()=>{
            req.flash('success',`Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});
router.get('/login',(req,res)=>{
    res.render('login',{message:req.flash('error','Please log in first')});
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.redirect('/login?info=' + info);
      }
  
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
  
        return res.redirect('/campgrounds');
      });
  
    })(req, res, next);
  });
// router.post('/login',passport.authenticate("local",{
//     successRedirect:'/campgrounds',
//     failureRedirect:'/campgrounds',
//     failureFlash:true,
//     successFlash:'Welcome to YelpCamp'
// },(req,res)=>{

// }));
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});
module.exports=router;