const mongoose = require("mongoose"),
 bcrypt = require('bcrypt'),
{Schema} = mongoose,
userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },  
    status: {
        type: Number,
        default: 2
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    billing: {
        type: Number,
        default: 0
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'departments'
    }
});

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("clients", userSchema);