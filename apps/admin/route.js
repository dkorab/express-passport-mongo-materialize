const express = require('express');
const path = require('path');
const router = express.Router();
const {isAuthenticated} = require('../../middleware/auth');


/* GET admin home page. */
router.get('/', isAuthenticated, (req, res) => {
    res.render(path.join(__dirname, 'views', 'index'), {
        layout: path.join(__dirname, 'views', 'layouts', 'admin'),
        user: req.user,
        pageCss: '/css/pages/admin/index.css',
        pageJs: '/js/pages/admin/index.js',
        pageTitle: `Welcome ${req.user.username}`
    });
});

// add login local routing
require('./loginRoute')(router);

// add auth local routing
require('./authRoute')(router);

module.exports = router;
