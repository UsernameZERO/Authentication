const mongoose = require('mongoose');

//Connecting mongoose to mongodb
// mongoose.connect('mongodb://localhost/authentication');
const dbUrl = 'mongodb+srv://UsernameZero:UsernameZero@cluster0.oe1eg.mongodb.net/authenticator';
mongoose.connect( dbUrl , {useNewUrlParser: true});

const db = mongoose.connection; // storing the data from mongoDB to initialized variable

db.on('error', console.error.bind(console, "Error in connecting the db"));

db.once('open', function(){
    console.log("Connected to Database :: MongoDB ");
});

module.exports = db;