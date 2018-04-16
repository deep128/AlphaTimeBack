

var bookshelf = function (config) {
    var knex = require("knex")({
        client: "mysql",
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "classtime"
        }
    });
    var bookshelf_v = require("bookshelf")(knex);

    return bookshelf_v;
}

module.exports = {
    bookshelf
}