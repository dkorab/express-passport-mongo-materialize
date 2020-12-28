const passport = require('passport')
const socialCallback = require('../../middleware/auth-social-callback');

const {isAuthenticated, isNotAuthenticated} = require('../../middleware/auth');

/**
 * Passport facebook and google oauth2.0 routing
 * @module auth
 * @param router
 */
module.exports = (router) => {
    /* <<<<<<<<<<<<<<<<<<<<< GOOGLE >>>>>>>>>>>>>>>>>>>> */

    /* GET auth google redirect */
    router.get('/auth/google', isNotAuthenticated, passport.authenticate('google', {scope: ['openid'], state: 'auth'}));

    /* GET register google redirect */
    router.get('/auth/google/register', isAuthenticated, passport.authenticate('google', {scope: ['openid'], state: 'register'}));

    /* GET auth google callback */
    router.get('/auth/google/callback', socialCallback('google'));

    /* <<<<<<<<<<<<<<<<<<<<< FACEBOOK >>>>>>>>>>>>>>>>>>>> */

    /* GET auth facebook redirect */
    router.get('/auth/facebook', isNotAuthenticated, passport.authenticate('facebook', {state: 'auth'}));

    /* GET register facebook redirect */
    router.get('/auth/facebook/register', isAuthenticated, passport.authenticate('facebook', {state: 'register'}));

    /* GET auth facebook callback */
    router.get('/auth/facebook/callback', socialCallback('facebook'));
}
