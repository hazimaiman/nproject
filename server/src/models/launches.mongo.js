const mongoose = require("mongoose");

const launchesSchema =  new mongoose.Schema({
    flightNumber: {
        type:Number,
        required:true,
        // default:100,
        // min:100,
        // max: 999,

    },
    launchDate: {
        type:Date,
        required: true,

    },
    mission: {
        type:String,
        required: true,

    },
    rocket: {
        type:String,
        required: true,

    },
    customers:[],
    target:{
        type:String,
        required: true,

    },
    upcoming: {
        type:Boolean,
        required: true,

    },
    success: {
        type:Boolean,
        required: true,
        default: true,
    },

});

// connects launchesschema wtih lauches collection
module.exports = mongoose.model("Launch", launchesSchema);