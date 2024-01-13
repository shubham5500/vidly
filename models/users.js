const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024,
    }
});

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;
        next();
    } catch (e) {
        return next(e)
    }
});

userSchema.methods.generateToken = function() {
    try {
        return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    } catch (error) {   
        throw new Error('user not found')
    }
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
       throw error 
    }
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(0).max(255).required().email(),
        password: Joi.string().min(1).max(255).required(),
    })
    
    return Joi.validate(user, schema);
}
const userModel = mongoose.model('Users', userSchema);


module.exports.validateUser = validateUser;
module.exports.Users = userModel;