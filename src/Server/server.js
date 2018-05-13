var request = require('request');
var path = require('path');

module.exports = function(moduleArg) {
    var express = require("express");
    var cors = require("cors");
    var bodyParser = require("body-parser");
    var cookieParser = require("cookie-parser");
    var crypto = require("crypto");
    var jwt = require("jsonwebtoken");

    var app = express();

    console.log("starting server...");
    var server = app.listen(process.env.PORT || moduleArg.config.port,()=>{
        console.log(`Listning on http://${server.address().address}:${server.address().port}`)
    });
    console.log();
    app.use("/public",express.static(path.join(path.dirname(require.main.filename), 'public')));
    app.use("/Images",express.static(path.join(path.dirname(require.main.filename), 'Images')));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use((req, res, next)=> {
        console.log(`${req.method}: ${req.url}   ${JSON.stringify(req.body)}`);
        next();
    });

    app.use((req, res, next)=> {

        var {User} = moduleArg.dbModels;
        
        if(req.headers['x-auth']) {
            const token = req.headers['x-auth'];
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
                    req.data = {
                        userid: user.id
                    };
                    next();
                }).catch((err)=>{
                    moduleArg.myUtils.logError(err, res);
                });

            });
        }
        else {
            if(['api','Images','public'].indexOf(req.url.split("/")[1])>=0)
                next();
            else {
                res.status(400).end("Unauthorized");
            }
        }
    });

    return app;
}