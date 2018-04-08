
 // module

var jwt = require("jsonwebtoken");
var _ = require("lodash");
var {User} = require("../Models/User");

module.exports = function(moduleArg) {
    moduleArg.app.post("/api/authservice", function(req, res) {
        
        var body = _.pick(req.body, ["Username", "Password"]);
        
        User.findOne({
            Username: body.Username,
            Password: body.Password
        }).then((user) => {
            res.send(user);
        });
        
        
        /*
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
          }); */
    });

    /*moduleArg.app.get("/api/authservice/:token", function(req, res) {
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
    });*/
}