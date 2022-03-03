const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../model/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: '984973103347-de6l29pv7871lgec67k28m3iufh6hunc.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:1111/auth/google/callback'
    }, function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err) { console.log("error in google strategy-passport", err); return }
            console.log(profile);
            if (user) {
                 // if found, set this user as req.user
                return done(null, user);
            }else{
                 // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if (err) {
                    console.log("error in creating user in googleauth ", err);
                    return;
                }
                return done(null, user);
            });
            }
        });
    }
));

module.exports = passport;
