const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Songs = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    haveVideo: {
        type: Boolean,
        required: true
    },
    link: {
        type: String,
        required: false,
        default:''
    },
    published: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('Songs', Songs);