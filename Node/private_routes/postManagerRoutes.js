var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/postManagerController');

router.route('/store/posts').delete(ctrl.deleteStorePost);
router.route('/store/posts').put(ctrl.modifyStorePost);
router.route('/store/posts').post(ctrl.postStorePosts);

module.exports = router;