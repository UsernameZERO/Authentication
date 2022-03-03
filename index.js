const express = require('express');
const app = express();
const fetch = require("isomorphic-fetch");
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const port = process.env.PORT || 1111;
const session = require('express-session');
const passport =require('passport');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session); // install connect-mongo@3
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const flashMiddleWare = require('./config/middleware');

// For Using Sass
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,// it is false in production mode
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use(expressLayouts);//To use the layout after installation
//For extracting the multiple styles and scripts to to layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');//ejs is set after installation
app.set('views', './views');//ejs is set to folder of where we use

//MongoStore is used to store the session cookie in the db
app.use(session({
    name: 'authentication',
    secret: 'lolol',
    saveUninitialized: false,
    resave: false,
    cokkie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },function(err){
        console.log(err || 'connect-mongodb setup oK');
    })
}));

//To session
app.use(passport.initialize());
app.use(passport.session());

//For Flash Messages
app.use(flash());
app.use(flashMiddleWare.setFlash);

//Router is added
app.use('/', require('./routes'));

//To run on a server
app.listen(port, (err)=>{
    if (err) {
       console.log(`Error in listening the server ${err}`);
    }
     console.log(`Listening in the port ${port}`);
});
