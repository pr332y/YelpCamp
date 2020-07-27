var express=require("express"), 
    app=express(), 
    bodyParser=require("body-parser"),
    mongoose=require('mongoose'), 
    flash=require('connect-flash'),
    passport=require('passport'),
    LocalStrategy=require('passport-local').Strategy,
    User=require('./models/user'),
    methodOverride=require('method-override'),

    commentRoutes=require('./routes/comments'),
    campgroundRoutes=require('./routes/campgrounds'),
    indexRoutes=require('./routes/index')
//seedDB();
mongoose.connect('mongodb+srv://preezy:sHmEeP@cluster0.7ev5t.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connected to db")
}).catch(err=>{
    console.log("error",err.message);
});

//mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(require('express-session')({
    secret:"meeeeeeeeeeeeeeeeep",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user,done)=>{
    done(null,user._id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//Alert messages
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000,()=>{
 });