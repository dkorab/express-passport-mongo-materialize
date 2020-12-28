const bcrypt =require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const {google, facebook} = require('./keys');

// Load User Model
const User = mongoose.model('users');

const socialVerify = method => {
    return (accessToken, refreshToken, profile, done) => {
        // Check profile ID
        if (!profile.hasOwnProperty('id') || typeof profile.id !== 'string') {
            return done(null, false, 'Wrong ID');
        }

        let query = {}
        query[method + '_id'] = profile.id;

        // Find user in mongo
        User.findOne(query).then(user => {
            if (!user) {
                return done(null, false, {profile: {id: profile.id}});
            }

            return done(null, user);
        }).catch(err => done(err));
    }
}

module.exports = function (passport) {
    // Google oauth2.0 strategy
    passport.use(new GoogleStrategy({
        clientID: google.clientID,
        clientSecret: google.clientSecret,
        callbackURL: google.callbackURL,
        proxy: true
    }, socialVerify('google')));

    // Facebook oauth2.0 strategy
    passport.use(new FacebookStrategy({
        clientID: facebook.clientID,
        clientSecret: facebook.clientSecret,
        callbackURL: facebook.callbackURL,
        enableProof: true,
        profileFields: ['id'],
        proxy: true
    }, socialVerify('facebook')));

    // Local strategy
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
        }).catch(err => done(err));
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // removing tokens for security, no needed in most cases
        User.findById(id, '-password -facebook_id -google_id -__v', function(err, user) {
            done(err, user); // TODO: add error redirect to login page
        });
    });
}
