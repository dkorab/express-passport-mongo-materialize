const passport = require('passport');

module.exports = method => {
    return (req, res, next) => {
        passport.authenticate(method, {}, async function (err, user, info) {
            if (err) {
                return next(err);
            }
            const state = req.query.state || 'auth';

            req.flash(); // clean old
            if (state === 'auth') {
                if (!user) {
                    req.flash('notify', {
                        text: 'No account is assigned to your profile',
                        type: 'error'
                    });
                    return res.redirect('/admin/login');
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.redirect('/admin');
                    });
                }
            } else if (state === 'register') {
                if (!info.profile || !info.profile.id || !req.user) {
                    req.flash('notify', {
                        text: 'Something went wrong',
                        type: 'error'
                    });
                } else {
                    req.user[method + '_id'] = info.profile.id;
                    try {
                        await req.user.save();
                    } catch (err) {
                        return next(err);
                    }
                }
                return res.redirect('/admin');
            }
        })(req, res, next);
    };
}
