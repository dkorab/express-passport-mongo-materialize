const express = require('express');
const router = express.Router();
const path = require('path');

// /* GET admin home page. */
// router.get('/', function(req, res, next) {
//   res.render(path.join(__dirname,'views', 'index'), { title: 'Admin' });
// });

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render(path.join(__dirname,'views', 'login'), {layout: path.join(__dirname,'views', 'layouts', 'admin'), pageCss: '/css/pages/admin/login.css'});
});

// /* GET register page. */
// router.get('/register', function(req, res, next) {
//   res.send('register');
// });

module.exports = router;
