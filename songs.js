const Songs = require('../models/songs')

const getSongs = async (req, res) => {
    const songs = await Songs.find()

    res.json({
        songs
    })
};

const createSong = async (req, res) => {
    const {name, author, rating, haveVideo, link} = req.body
    await validateSongRequest(req, res)
    const newSong = new Songs({
        name,
        author,
        rating,
        haveVideo,
        link
    })

    await newSong.save().catch(e => console.log(e))
    const io = req.app.get('socketio');
    io.emit('new-song', {
        song: newSong
    });
    
    res.json({
        newSong
    })
}

function IsEmpty(name, author, rating) {
    return (!name || !author || !rating);

}

async function validateSongRequest(req, res) {
    const {name, author, rating, haveVideo, link} = req.body;
    if (IsEmpty(name, author, rating)) {
        return res.status(404).json({errors: ['Missing some variables exists']});

    }
    const dbsong = await Songs.findOne({name, author, rating, haveVideo, link});

    if (dbsong) {
        return res.status(404).json({errors: ['Song already exists']});
    }

}

const updateSong = async (req, res) => {
    const {id} = req.params
    const {name, author, rating, haveVideo, link} = req.body
    await validateSongRequest(req, res)

    const song = await Songs.findById(id)

    if (!song) {
        return res.status(404).json({errors: ['Song not found']});
    }

    await Songs.updateOne({_id: id}, {name, author, rating, haveVideo, link})

    const songs = await Songs.find()
    res.json({
        songs,
        message: 'Song updated!'
    })
}

const deleteSong = async (req, res) => {
    const {id} = req.params

    const deleted_song = await Songs.findById(id)

    if (!deleted_song) {
        return res.status(404).json({errors: ['Song not found']});
    }

    await Songs.deleteOne({_id: id})
    res.send('Song deleted!');
    const io = req.app.get('socketio');
    io.emit('deleted-song', {
        song: deleted_song
    });
    const songs = await Songs.find()
    res.json({
        songs
    })
}

module.exports = {
    getSongs,
    createSong,
    updateSong,
    deleteSong
};