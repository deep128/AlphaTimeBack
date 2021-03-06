//index.js

var fs = require("fs");
var path = require ("path");

console.log("Reading config...");
var config = JSON.parse(fs.readFileSync("./config.json","UTF-8"));
var myUtils = require("./src/Utilities/MyUtils")(config);


var components = {
    modulesPath: []
};

var bookshelf = require("./src/Server/db/connect").bookshelf(config);
var con = require("./src/Server/db/connect").con(config);
var {sqlquery} = require("./src/Server/db/connect");
var dbModels = require("./src/Server/db/dbModles").createModels(bookshelf);

var moduleArg = {
    app,
    bookshelf,
    config,
    dbModels,
    myUtils,
    con,
    sqlquery
}

var app = require("./src/Server/server")(moduleArg);
moduleArg.app = app;


console.log("Reading source...");
components.modulesPath = getAllFlilsPath("./src");

components.modulesPath.forEach(function(modulePath) {
    require(modulePath)(moduleArg);
});

function getAllFlilsPath(dir) {
    var filesList = [];
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var inPath = dir + "/" + file;
        var stat = fs.statSync(inPath);
        if(stat && stat.isDirectory()) {
            filesList = filesList.concat(getAllFlilsPath(inPath));
        }
        else if(stat) {
            var content = fs.readFileSync(inPath);
            pattern = /\w*[/][/]\s*module/i;
            var match = pattern.exec(content);
            if(match) {
                filesList.push(inPath);
            }
        }
    });
    return filesList;
}