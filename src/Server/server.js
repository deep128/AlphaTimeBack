
module.exports = function(config) {
    var express = require("express");
    var cors = require("cors");
    var bodyParser = require("body-parser");
    var cookieParser = require("cookie-parser");
    var crypto = require("crypto");
    var jwt = require("jsonwebtoken");

    //config.secret = crypto.randomBytes(20).toString();

    var app = express();

    console.log("starting server...");
    var server = app.listen(config.port,()=>{
        console.log(`Listning on http://${server.address().address}:${server.address().port}`)
    });

    app.use(express.static("./public"));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(function(req, res, next) {
        console.log(req.headers["authorization"]);

        var pattern = /^Bearer /;
        var match = pattern.exec(req.headers.authorization);
        if(match) {
            var token = req.headers.authorization.replace(pattern,"");
            jwt.verify(token, config.secret, function(err, decoded) {      
                if (err) {
                    console.log(res.json({ success: false, message: 'Failed to authenticate token.' }));    
                } else {
                    // if everything is good, save to request for use in other routes
                    console.log(decoded);
                    next();
                }
            });
        }

        console.log(`${req.method}: ${req.url}   ${JSON.stringify(req.body)}`);
        next();
    });

    return app;
}