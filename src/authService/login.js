
 // module

var jwt = require("jsonwebtoken");

module.exports = function(moduleArg) {
    moduleArg.app.get("/api/authservice", function(req, res) {
        if(!req.headers.authorization) {
            throw "Unauthorized!";
        }
        var pattern = /^Basic /;
        var match = pattern.exec(req.headers.authorization);
        if(match) {
            var auth = Buffer.from(req.headers.authorization.replace(pattern,""),'base64').toString().split(":");
        }
        else {
            throw "Unauthorized!";
        } 

        var userAuth = {
            username : auth[0],
            password : auth[1]
        }

        const sql = `SELECT id  FROM users WHERE username = '${userAuth.username}' AND password = '${userAuth.password}'`;

        moduleArg.con.query(sql, function (err, result) {
            if (err) 
                res.status(400).end("Unauthorized");
            else {
                const payload = {
                    userId: result[0].id
                }
    
                var token = jwt.sign(payload, moduleArg.config.secret, {
                    expiresIn: 1440
                });
                res.status(200);
                res.end(token);
            }
          });
        });

    moduleArg.app.get("/api/authservice/:token", function(req, res) {
        var token = req.params.token;
        jwt.verify(token, moduleArg.config.secret, function(err, decoded) {
            if(err) {
                res.status(400).end("Unauthorized");
            }
            else {
            const sql = `SELECT id  FROM users WHERE id = ${decoded.userId}`;

            moduleArg.con.query(sql, function (err, result) {
                if (err)
                    res.status(500).end("Internal error");
                else {
                    if(result.length > 0)
                        res.status(202).end("");
                }
            });
            }
        });
    });
}