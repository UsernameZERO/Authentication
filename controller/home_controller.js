const fetch = require("isomorphic-fetch");
const User = require("../model/user");
const bcrypt = require('bcryptjs');//For encrypting the password and to compare the passwords

//Rendering the home page
module.exports.home = function(req, res){
    return res.render('home', {
        title: "HOME"
    });
}

//Rendering the signup page
module.exports.signup = function(req, res){
    return res.render('signup', {
        title: 'Sign-Up'
    });
}

//rendering the profile page
module.exports.profile = async function(req, res){
    let user = await User.findById(req.user._id);
    return res.render('profile',{
        title: 'profile',
         user : user,
    });
}

//creating the user from sign up page
module.exports.create = function(req, res){
    // console.log(req.body.password);
    // console.log(req.body.c_password);
    if (req.body.password != req.body.c_password) { // checking whether passwords are correct
        req.flash('error', "passwords are not matched");
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if (err) {
            console.log("error in finding user in signing up");
            return;
        }
        if (!user) {
            User.create(req.body, function(err, user){
                if (err) {
                    console.log("error in creating the user");
                    return;
                }
                //Checking whether the captcha is done or not
                if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                    // not passed validation
                    req.flash('error', 'captcha is not done');
                    return res.redirect('back');
                  }else{    
                    return res.redirect('/');
                  }
            });
        }
    });

}

module.exports.createSession =  function(req, res){
     //Checking whether the captcha is done or not
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        // not passed validation
        req.flash('error', 'captcha is not done');
        return res.redirect('/');
      }else{ 
          req.flash('success', 'Logged In');   
        return res.redirect('/profile');
      }
}

module.exports.signinwithgoogle = function(req, res){
    return res.redirect('/profile');
}

//signing out
module.exports.logout = function(req, res){
    req.logout();
    req.flash('success', 'Logged Out ');
    return res.redirect('/');
}

//To reset the password
module.exports.updatePwd = async function(req,res){
    // console.log(req.params);
    // console.log(req.params.id);
    User.findById(req.params.id, async function(err, user){
        // console.log(user.password);
        let bool = bcrypt.compareSync(req.body.password, user.password);// checking whether old password is correct or not
        // console.log(bool);
        if(bool == false){
            req.flash('error', 'Old Password is incorrect');
            return res.redirect('back');
        }
        if(req.body.n_password === req.body.c_password){
            //changing into encrypted password
            const hashPassword = await bcrypt.hash(req.body.n_password, 10);
         let usr =   await User.findByIdAndUpdate({_id: user._id}, {password: hashPassword });
            usr.save();
            // console.log("Password is changed ");
            req.flash('success', 'Password is changed');
            return res.redirect('back');
        }else{
            req.flash('error', 'passwords are not matched');
            // console.log("password did not match");
            return res.redirect('back');
        }
    })
   
   
}