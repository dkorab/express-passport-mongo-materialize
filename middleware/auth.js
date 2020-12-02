module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('login', {type: 'error', text: 'You are not authorized for this resources'});
        res.redirect('/admin/login');
    }
}
