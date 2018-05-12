

var bookshelf = function (config) {
    var knex = require("knex")({
        client: "mysql",
        connection: config.db
    });
    var bookshelf_v = require("bookshelf")(knex);

    return bookshelf_v;
}

module.exports = {
    bookshelf
}