var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/storeController');


//router.route('/store/posts').get(ctrl.getAllStorePosts);
//router.route('/profile/posts/:userId').get(ctrl.getProfilePosts);
module.exports = router;