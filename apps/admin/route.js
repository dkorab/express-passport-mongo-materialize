const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const {isAuthenticated} = require('../../middleware/auth');


/* GET admin home page. */
router.get('/', isAuthenticated, (req, res) => {
    console.log(req.user);

    res.send('Admin (logged in) <a href="/admin/logout">logout</a>');
});

// add login local routing
require('./login')(router);

// add auth routing
require('./auth')(router);

module.exports = router;
