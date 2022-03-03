const express = require('express');
const router = express.Router();
const passport = require('passport');

//Controller
const homeController = require('../controller/home_controller');

// console.log("entered to router");

//Rendering through routes
router.get('/', homeController.home);
router.get('/signup', homeController.signup);

//To create user
router.post('/create', homeController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/'}
), homeController.createSession);// To log-in

router.get('/profile', passport.checkAuthentication, homeController.profile);
//To Log Out
router.get('/signout', homeController.logout); 

router.post('/update-password/:id', homeController.updatePwd);//To Reset password after sign in

//To log in with google authentication
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), homeController.signinwithgoogle);

module.exports = router;