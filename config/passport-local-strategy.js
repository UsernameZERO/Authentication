
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcryptjs');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,  // for req for flash messaged
},
function(req, email, password, done){
    User.findOne({email: email}, function(err, user){
        if (err) {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        if (user) {
            let bool = bcrypt.compareSync(password, user.password); // checking whether password equal to the encrypted password
        if (bool == false) {
            req.flash('error', 'Invalid Password');
            console.log('Invalid Password');
            return done(null, false);
        }
        return done(null, user);
        }
        req.flash('error', 'Invalid email /Invalid password');
        return done(null, user);
    });
}

));

//serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user,done){
    done(null, user.id);

});

//deserialize the user from the key in the cookies  
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if (err) {
            console.log('Error in finding user --> deserialized(Passport)');
            return done(err);
        }
        return done(null, user);
    });
});

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
} 

//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if user is signed in ,then pass on next request
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');// if the user is not signed in
}


module.exports = passport;
