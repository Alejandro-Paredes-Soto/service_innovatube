const { Router } = require('express');
const { getListVideos, searchVideo, favoriteVideo, getListVideosFavorites, removeFavoriteVideo } = require('../../controllers/videos.controller')
const { auth } = require("./../../middleware/middleware")

const router = Router();

router.get('/', auth, getListVideos);

router.post('/search', auth, searchVideo);

router.post('/favorites', auth, favoriteVideo)

router.get("/listFavorites", auth, getListVideosFavorites)

router.post('/removeFavoriteVideo', auth, removeFavoriteVideo)



module.exports = router;