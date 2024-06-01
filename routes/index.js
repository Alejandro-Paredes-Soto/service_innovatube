const { Router } = require('express')
const routeVideos = require('./videos')
const routeUsers = require('./users/users.route')
const routePassword = require('./password/password.route')

const router = Router();

router.use('/videos', routeVideos);
router.use('/users', routeUsers);
router.use('/password', routePassword)

module.exports = router;
