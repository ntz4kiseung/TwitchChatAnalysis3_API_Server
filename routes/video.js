const router = require('express').Router();
const handle = require('../handlers');

router.route('/').get(handle.testVideo);
router.route('/search/:videoId').get(handle.getVideo);
router.route('/search/:videoId/:keyword').get(handle.searchKeyword);
router.route('/save/:videoId/').get(handle.saveVideo);

module.exports = router;