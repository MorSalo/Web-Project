const Songs = require('../models/songs')
const {TwitterApi} = require('twitter-api-v2');
const getSongs = async (req, res) => {
    const songs = await Songs.find()

    res.json({
        songs
    })
};

const createSong = async (req, res) => {
    const {name, author, likes, haveVideo, link} = req.body
    const client = new TwitterApi({
        appKey: 'oO1ZDPJXgrpWuX07g0kKWBLUX',
        appSecret:'yWuUmIoZD9w12kTqybhGO9SWbneGuktXCWpe6qSW0jdJlAE9rS',
        accessToken: '1648738358539976707-FCYIk9QGJO8BMhCoS5prpPCSIDxoRU',
        accessSecret: 'ks74KGnXAUtZIugiy5eedSSK2I0PfunmNLYk3dQDqowi0'
    })
    if( await validateSongRequest(req, res)!=1)
    return;
    await client.v1.tweet("New disc: "+name+" by "+author+" available in store and web app");
    const newSong = new Songs({
        name,
        author,
        likes,
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

function IsEmpty(name, author) {
    return (!name || !author);

}

async function validateSongRequest(req, res) {
    const {name, author, likes, haveVideo, link} = req.body;
    if (IsEmpty(name, author)) {
        return res.status(404).json({errors: ['Missing some variables exists']});
    }
    const dbsong = await Songs.findOne({name, author ,haveVideo, link});

    if (dbsong) {
        return res.status(404).json({errors: ['Song already exists']});
    }
    return 1;
}

const updateSong = async (req, res) => {
    const {id} = req.params
    var {name, author, likes, haveVideo, link} = req.body
    if(await validateSongRequest(req, res)!=1)
    {
        return;
    }
    const song = await Songs.findById(id)

    if (!song) {
        return res.status(404).json({errors: ['Song not found']});
    }

    await Songs.updateOne({_id: id}, {name, author, likes, haveVideo, link})
    const updatedSong = await Songs.findOne({name, author, likes, haveVideo, link});
    const songs = await Songs.find()
    const io = req.app.get('socketio');
    io.emit('updated-song', {
        song: updatedSong
    });
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
    const io = req.app.get('socketio');
    io.emit('deleted-song', {
        song: deleted_song
    });
    const songs = await Songs.find()
    res.json({
        songs
    })
}

const findSongs = async (req,res) => {
    console.log("in the controller")
    const {name,author,haveVideo} = req.params
    console.log("Controllers: the params we got from routs: "+"name= "+name+" ,author= "+author+" ,haveVideo= "+haveVideo);
    const songs = await findAllSongs(name,author,haveVideo);
    if(songs == undefined){
      return res.json({songs})
    }
    res.json({songs});
  }
const findAllSongs = async (name2,author2,haveVideo2) => {
    console.log("Services: the params we got from the controller are: "+ "name= "+name2+" ,author= "+author2+" ,haveVideo= "+haveVideo2)
    if(name2 != undefined && author2 != undefined && haveVideo2 != undefined){
        const ret =Songs.find({name:name2,author:author2,haveVideo:haveVideo2})
        return ret
    }
    //name author
    else if(name2 != undefined && author2 != undefined && haveVideo2 == undefined){
        const ret =Songs.find({name:name2,author:author2})
        return ret
    }
    //name haveVideo
    else if(name2 != undefined && author2 == undefined && haveVideo2 != undefined){
        const ret =Songs.find({name:name2,haveVideo:haveVideo2})
        return ret
    }
    //author haveVideo
    else if(name2 == undefined && author2 != undefined && haveVideo2 != undefined){
        const ret =Songs.find({author:author2,haveVideo:haveVideo2})
        return ret
    }
    //name
    else if(name2 != undefined && author2 == undefined && haveVideo2 == undefined){
        const ret =Songs.find({name:name2})
        return ret
    }
    //author
    else if(name2 == undefined && author2 != undefined && haveVideo2 == undefined){
        const ret =Songs.find({author:author2})
        return ret
    }
    //haveVideo
    else if(name2 == undefined && author2 == undefined && haveVideo2 != undefined){
        const ret =Songs.find({haveVideo:haveVideo2})
        return ret
    }
    //nothing
    else if(name2 == undefined && author2 == undefined && haveVideo2 == undefined){
        return undefined
    }
}

const getSongsGroupedBy = async (req, res) => {
    const songs = await Songs.aggregate([
        {
            $group: {
                _id: '$author',
                count: { $sum: 1 } // this means that the count will increment by 1
            }
        }
    ]);

    res.json({
        songs
    })
}
module.exports = {
    getSongs,
    createSong,
    updateSong,
    deleteSong,
    findSongs,
    getSongsGroupedBy
};