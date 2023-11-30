const mongoose = require("mongoose"),
{Schema} = mongoose,
sendingSchema = new Schema({
    properties: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },  
    status: {
        type: Number,
        default: 0
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'departments',
        required: true
    },
    date: {
        type: Date,
        default: new Date(),
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'clients',
        required: true
    }
});


module.exports = mongoose.model("sendings", sendingSchema);