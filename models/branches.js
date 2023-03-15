const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Branch = new Schema({
    // _id:{
    //     type:String,
    //     required:true
    // },
    city: {
        type: String,
        required: true
    },
    address: {
        type:String,
        required:true 
    },
    years: {
        type:Number,
        required:true 
    },
    open:{
        type:Boolean,
        required:true
    }

});


module.exports = mongoose.model('Branch', Branch);