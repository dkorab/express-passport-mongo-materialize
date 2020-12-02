const bcrypt =require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Load User Model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({}, (username, password, done) => {
        // check for not allowed characters
        const reSpecial = new RegExp('^[^<>%\$\'";()\\\\/]*$');

        if (!reSpecial.test(username)) {
            return done(null, false, 'Wrong username format');
        }

        // Find user in mongo
        User.findOne({
            username: username
        }).then(user => {
            if (!user) {
                return done(null, false, 'User not found');
            }

            // check password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, 'Password incorrect');
                }
            })
        });
    }) );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
