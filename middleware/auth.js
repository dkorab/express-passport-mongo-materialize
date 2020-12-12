module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('notify', {type: 'error', text: 'You are not authorized to use these resources'});
        res.redirect('/admin/login');
    },
    isNotAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }

        res.redirect('/admin');
    }
}
