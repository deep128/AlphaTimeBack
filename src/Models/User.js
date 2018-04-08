var mongoose = require("mongoose");

var User = mongoose.model("User", {
    Username: {
        type:String,
        required: true,
        minlength: 1,
        trim:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    }
});

module.exports = {User};