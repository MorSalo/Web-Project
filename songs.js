const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songs');

router.route('/')
    .get(songsController.getSongs)
    .post(songsController.createSong)

router.route('/:id')
    .put(songsController.updateSong)
    .delete(songsController.deleteSong)

module.exports = router;