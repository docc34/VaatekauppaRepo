var express = require('express');
var app = express();
var router = express.Router();
let ctrl = require('../controllers/ProfileController');


//router.route('/profile/basicInfo/:userId', userIdCheckMiddleWare).get(ctrl.getProfileData);
router.route('/profile/basicInfo').put(ctrl.setProfileData);
router.route('/profile/education').post(ctrl.postEducation);
router.route('/profile/education').delete(ctrl.deleteEducation);
router.route('/profile/jobs').post(ctrl.postJobs);
router.route('/profile/jobs').delete(ctrl.deleteJobs);

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