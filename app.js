var express = require('express');
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var hbs=require('express-handlebars');
var fs=require('fs');
var mysql=require('mysql');
var async=require('async');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var expressSession=require('express-session');
var app = express();


/*
Access the modules
*/
var bot=require('./modules/conChatbot.js');
var canvas = require('./modules/conCanvas.js');
var timeline = require('./modules/conTimeline.js');
var search=require('./modules/search.js');
var signup=require('./modules/signup.js');
var login=require('./modules/login.js');
var charts=require('./modules/charts.js');
var incidence=require('./modules/conIncidence.js');
var simsConnection = require('./modules/simsConnection.js');
var updateEs=require('./modules/updateEs');
var settings = require('./modules/settings.js');
//Passport middleware
app.use(require('morgan')('combined'));
app.use(passport.initialize());
app.use(passport.session());



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));


// handleBar view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs({
  extname:'hbs',
  defaultLayout:'main',
  layoutsDir:__dirname + '/views/layouts/'
} ) );

/*
CORS solution
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
express-session
*/
app.use(expressSession({secret: "Shh, its a secret!", saveUninitialized:true, resave:true}));

app.use('/signup',signup);
app.use('/login', login);
app.use('/canvas', canvas);
app.use('/timeline',isAuthenticated, timeline);
app.use('/home',isAuthenticated,search);
app.use('/incidence',isAuthenticated,incidence);
app.use('/charts',isAuthenticated,charts);
app.use('/updatepass', settings);
app.use('/chatbot',isAuthenticated,bot);

function isAuthenticated(req,res,next){
    if(req.session.user)
        next()
    else
        res.render('login',{layout:'portal',session:'true',validate:''});
}

app.get('/',function(req,res){
  res.render('main',{layout:'portal'});
});

app.get('/login.htm',function(req,res){
    if(req.session.user)
        res.redirect('/home');
    else
    res.render('login',{layout:'portal',session:'',validate:''});
});
app.get('/signup.htm',function(req,res){
    res.render('signup',{layout:'portal'});
});


app.get('/refer-a-friend',isAuthenticated,function(req,res){
    res.render('Refer',{layout:'mainamit',username:req.session.user});
});

app.get('/tickets',isAuthenticated,function(req,res){
    res.render('Ticket',{layout:'mainamit',username:req.session.user});
});

app.get('/solutions',isAuthenticated,function(req,res){
    res.render('Solution',{layout:'mainamit',username:req.session.user});
});
app.get('/customers',isAuthenticated,function(req,res){
    res.render('customers',{layout:'mainamit',username:req.session.user});
});
app.get('/reports',isAuthenticated,function(req,res){
    res.render('Reports',{layout:'mainamit',username:req.session.user});
});
app.get('/profile',isAuthenticated,function(req,res){
     simsConnection.query("select um.username,um.phone1,um.EmailId1,lm.locName from usermaster um inner join location lm on um.userid=lm.owner where um.username=?",req.session.user,function (err,rows){
        if(err)
            console.err(err);
         else
            res.render('Profile',{layout:'main',username:req.session.user,rows});
     });
});
app.get('/settings',isAuthenticated,function(req,res){
    res.render('Settings',{layout:'main',username:req.session.user});
});
app.get('/help',isAuthenticated,function(req,res){
    res.render('help',{layout:'main',username:req.session.user});
});



app.get('/api',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/logout',function (req,res) {
  req.session.destroy();
  res.send({redirect:'/login.htm'});
});

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback',
passport.authenticate('google', {
  successRedirect : '/home',
  failureRedirect : '/login'
}));




app.get('/login/facebook',
passport.authenticate('facebook',{scope:'email'}));

app.get('/login/facebook/return',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/home');
  console.log("facebook");

});

/*
passport middleware
*/
passport.use(new GoogleStrategy({

        clientID        : "334707939416-m8n2ja39f6f9qmb7m918fqdev5qmu9bs.apps.googleusercontent.com",
        clientSecret    : 'cWsIdHZSk6HubgZUU2qWyheJ',
        callbackURL     : 'http://localhost:3000/auth/google/callback',

    },
    function(token, refreshToken, profile, done) {
        /*process.nextTick(function() {
         User.findOne({ 'google.id': profile.id }, function(err, user) {
         if (err)
         return done(err);
         if (user) {
         return done(null, user);
         } else {
         var newUser = new User();
         newUser.google.id = profile.id;
         newUser.google.token = token;
         newUser.google.name = profile.displayName;
         newUser.google.email = profile.emails[0].value;
         newUser.save(function(err) {
         if (err)
         throw err;
         return done(null, newUser);
         });
         }
         });
         });*/
        console.log(profile);
        return done(null, profile);

    }));
passport.use(new Strategy({
        clientID: "763628167127877",
        clientSecret: "e47b6ad6478649ace2a8715263c9f71e",
        callbackURL: 'http://localhost:3000/login/facebook/return',
        profileFields: ['id', 'displayName', 'photos', 'email']

    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        return cb(null, profile);

    }));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.get('*',function (req,res) {
  res.render('pages-404',{layout:'portal'})
});

app.listen(3000,function(){
console.log("Server started at port 3000");
}
);
