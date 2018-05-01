
module.exports = function(moduleArg) {
    var express = require("express");
    var cors = require("cors");
    var bodyParser = require("body-parser");
    var cookieParser = require("cookie-parser");
    var crypto = require("crypto");
    var jwt = require("jsonwebtoken");

    var app = express();

    console.log("starting server...");
    var server = app.listen(moduleArg.config.port,()=>{
        console.log(`Listning on http://${server.address().address}:${server.address().port}`)
    });

    app.use(express.static("./public"));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(function(req, res, next) {

        var {User} = moduleArg.dbModels;

        console.log(`${req.method}: ${req.url}   ${JSON.stringify(req.body)}`);
        if(req.headers['x-auth']) {
            const token = req.header['x-auth'];
            jwt.verify(token, moduleArg.config.secret, (err, decoded)=>{
                if(err) {
                    res.status(400).end("Unauthorized");
                    return;
                }

                new User({"id":decoded.id}).fetch({columns:"id"}).then((user)=>{
                    if(user == null) {
                        res.status(400).end();
                        return;
                    }
                }).catch((err)=>{
                    res.status(500).send("Error handleing the request");
                });

                next();
            });
        }
        else {
            next();
        }
    });

    return app;
}