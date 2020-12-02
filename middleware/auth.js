module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('login', {type: 'error', text: 'You are not authorized for to these resources'});
        res.redirect('/admin/login');
    }
}
