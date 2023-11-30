const mongoose = require("mongoose"),
{Schema} = mongoose,
departmentSchema = new Schema({
    address: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },  
    max_weight: {
        type: Number,
        default: 1
    },
    lat: {
        type: Number,
        default: 48.621025
    },
    lon: {
        type: Number,
        default: 22.288229
    }
});


module.exports = mongoose.model("departments", departmentSchema);