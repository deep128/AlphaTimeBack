
  // module

 var jwt = require("jsonwebtoken");
 var _ = require("lodash");
 var {SHA256} = require("crypto-js");


 module.exports = function(moduleArg) {

    var {User} = moduleArg.dbModels;

    moduleArg.app.post("/api/login", function(req, res) {
        
        var body = _.pick(req.body, ["username", "password"]);
        new User({"Username":body.username,"Password":body.password}).fetch({columns:"id"}).then((user)=>{
            if(user == null) {
                res.status(200).send({
                    success: false,
                    msg:"Invalid Username and Password"
                });
                return;
            }

            var token = createJWTToken(user.id, moduleArg.config.secret);
            res.send({
                success:true,
                token
            });
        }).catch((err)=>{
            res.status(500).send("Error handleing the request");
            console.log(err);
        });
        
    });


    moduleArg.app.post("/api/authservice", function(req, res) {
        var {token} = _.pick(req.body,["token"]);
        
        jwt.verify(token, moduleArg.config.secret, function(err, decoded) {
            if(err) {
                res.status(400).end("Unauthorized");
            }
            else {
                new User({"id":decoded.id}).fetch({columns:"id"}).then((user)=>{
                    if(user == null) {
                        res.status(400).end();
                        return;
                    }

                    res.status(202).end("");
                }).catch((err)=>{
                    res.status(500).send("Error handleing the request");
                });


            }
        });

    });
 }

 function createJWTToken(id, key) {
    var data = {
        id
    };

    var token = jwt.sign(data,key);
    return token;
}