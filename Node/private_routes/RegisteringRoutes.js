var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/customerController');

router.route('/users/registering').post(ctrl.postKayttaja);
/*
router.route('/api/Datat').get(ctrl.getAsiakkaanTilaukset);
router.route('/api/tilaus').post(ctrl.postTilaus);
router.route('/api/tilaus/:id').get(ctrl.getAsiakkaanTilaukset);
router.route('/api/asiakas').get(ctrl.getAsiakas);
router.route('/api/asiakas/:id').delete(ctrl.deleteAsiakas);
router.route('/api/tilausrivi/:id').put(ctrl.muokkaaTilausriveja).get(ctrl.haeTilauksenRivit);;
*/

// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;