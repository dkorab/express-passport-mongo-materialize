const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../../middleware/auth');


/* GET admin home page. */
router.get('/', isAuthenticated, (req, res) => {
    console.log(req.user);

    res.send('Admin (logged in) <a href="/admin/logout">logout</a>');
});

// add login local routing
require('./login')(router);

// add auth local routing
require('./auth')(router);

module.exports = router;
