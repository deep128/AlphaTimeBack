var mysql = require("mysql");

var bookshelf = function (config) {
    var knex = require("knex")({
        client: "mysql",
        connection: config.db
    });
    var bookshelf_v = require("bookshelf")(knex);

    return bookshelf_v;
}
var con = function (config) {
    conn = mysql.createConnection(config.db);

    return conn;
}

module.exports = {
    bookshelf,
    con
}