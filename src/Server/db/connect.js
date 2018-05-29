var mysql = require("mysql");
var myUtils;

var bookshelf = function (config) {
    var knex = require("knex")({
        client: "mysql",
        connection: config.db
    });
    var bookshelf_v = require("bookshelf")(knex);

    return bookshelf_v;
}

var conn;

function dbConnect(config) {
    console.log("connecting to db...")
    conn = mysql.createConnection(config.db); // Recreate the connection, since

    conn.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(()=>{
              conn.end();
              dbConnect(config);
          }, 2000); // We introduce a delay before attempting to reconnect,
        } 
    });
}

var con = function (config) {
    
    dbConnect(config);
    myUtils = require("../../Utilities/MyUtils")(config);

    conn.on("error", function (error) {
        if (error instanceof Error) {
            if (error.code === "PROTOCOL_CONNECTION_LOST") {
                myUtils.logErrorS(error.stack);
                console.log("Lost connection. Reconnecting...");
                conn.end();
                dbConnect(config);
            } else if (error.fatal) {
                throw error;
            }
        }
    });

    return conn;
}

function sqlquery(sql, callback) {
  
      conn.query(sql,(err,result,fields)=>{
        if(err) {
            myUtils.logErrorS(err);
            return;
        }
        else {
          callback(result,fields);
        }
    });
}



module.exports = {
    bookshelf,
    con,
    sqlquery
}