const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Creating the Schema with required attributes
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    }

},{
    timestamps: true
});

//To encrypt the password before saving into db
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next()
    //changing into encrypted format 
    this.password = await bcrypt.hash(this.password, 10)
    next();
});
  
const User = mongoose.model('User', userSchema);

module.exports = User;