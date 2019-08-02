const router = require('express').Router();
const handle = require('../handlers');

router.route('/').get(handle.testStreamer);
router.route('/:name').get(handle.getStreamer);

module.exports = router;