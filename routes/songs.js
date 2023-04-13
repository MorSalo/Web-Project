const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songs');

router.route('/')
    .get(songsController.getSongs)
    .post(songsController.createSong)

router.route('/:id')
    .put(songsController.updateSong)
    .delete(songsController.deleteSong);
router.route('/name/:name?/author/:author?/haveVideo/:haveVideo?')
    .get(songsController.findSongs);
module.exports = router;