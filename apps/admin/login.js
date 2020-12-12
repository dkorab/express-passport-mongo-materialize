const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport')
const path = require('path');
const {isNotAuthenticated} = require('../../middleware/auth');

// Load User Model
require('../../models/User');
const User = mongoose.model('users');

// Const values for admin:
const passwordMin = 8;
const passwordMax = 128;
const reSpecial = new RegExp('^[^<>%\$\'";()\\\\/]*$');
const reEmail = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

module.exports = (router) => {
    /* <<<<<<<<<<<<<<<<<<<<< LOCAL >>>>>>>>>>>>>>>>>>>> */

    /* GET login page. */
    router.get('/login', isNotAuthenticated, (req, res) => {
        const notify = req.flash('notify');
        const errors = req.flash('error');

        errors.forEach(err => {
            notify.push({type: 'error', text: err});
        });

        res.render(path.join(__dirname, 'views', 'login'), {
            layout: path.join(__dirname, 'views', 'layouts', 'admin'),
            pageCss: '/css/pages/admin/login.css',
            pageJs: '/js/pages/admin/login.js',
            notify: notify,
            pageTitle: 'Login'
        });
    });

    /* POST login page. */
    router.post('/login', isNotAuthenticated, (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/admin/login',
            failureFlash: 'Invalid username and/or password'
            // failureFlash: true
        })(req, res, next);
    });

    /* GET logout user. */
    router.get('/logout', (req, res) => {
        req.logout();
        req.flash('notify', {text: 'You are successfully logged out', type: 'success'});
        res.redirect('/admin/login');
    });

    /* GET register page. */
    router.get('/register', isNotAuthenticated, (req, res) => {
        res.render(path.join(__dirname, 'views', 'register'), {
            layout: path.join(__dirname, 'views', 'layouts', 'admin'),
            passwordMin: passwordMin,
            passwordMax: passwordMax,
            pageCss: '/css/pages/admin/register.css',
            pageJs: '/js/pages/admin/register.js',
            pageTitle: 'Register'
        });
    });

    /* POST register page. */
    router.post('/register', isNotAuthenticated, async (req, res, next) => {

        let {username, email, password, password2} = req.body;

        [username, email, password, password2] = [username, email, password, password2].map(s => s.trim());

        // Validating data

        const errors = [];

        if (password !== password2) {
            errors.push({text: "Passwords don't match", type: 'error'});
        }

        if (password.length < passwordMin) {
            errors.push({text: `Password is too short, minimum length is ${passwordMin}`, type: 'error'});
        }

        if (password.length > passwordMax) {
            errors.push({text: `Password is too long, maximum length is ${passwordMax}`, type: 'error'});
        }

        if (!reSpecial.test(username)) {
            errors.push({text: 'Username contains special characters', type: 'error'});
        }

        if (!reEmail.test(email)) {
            errors.push({text: 'Wrong email format', type: 'error'});
        }

        // Test username
        const usernameExists = await User.exists({username: username});

        if (usernameExists) {
            errors.push({text: 'Username already exists', type: 'error'});
        }

        // Test username
        const emailExists = await User.exists({email: email});

        if (emailExists) {
            errors.push({text: 'Email is already reserved', type: 'error'});
        }

        if (errors.length > 0) {
            res.render(path.join(__dirname, 'views', 'register'), {
                layout: path.join(__dirname, 'views', 'layouts', 'admin'),
                passwordMin: passwordMin,
                passwordMax: passwordMax,
                notify: errors,
                username: username,
                email: email,
                pageCss: '/css/pages/admin/register.css',
                pageJs: '/js/pages/admin/register.js',
                pageTitle: 'Register'
            });
        } else {
            try {
                // generate hash for user
                const salt = await bcrypt.genSalt(13);
                const hash = await bcrypt.hash(password, salt);

                // create new User object
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hash
                });

                // save
                const user = await newUser.save();

                req.flash(); // clean old
                req.flash('notify', {
                    text: 'You have been correctly registered. Please, use your credentials to log in',
                    type: 'success'
                });

                // redirect to login page
                res.redirect('/admin/login');
            } catch (e) {
                next(e);
            }
        }
    });
}