var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

module.exports = {
    mongoose: (config) => {
        mongoose.connect(config.db.url);
        return mongoose;
    }
};

