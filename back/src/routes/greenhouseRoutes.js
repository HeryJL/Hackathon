const router = require('express').Router();
const controller = require('../controllers/greenhouseController');

router.get('/latest', controller.getLatest);
router.get('/history', controller.getHistory);

module.exports = router;