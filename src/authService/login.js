
  // module

 var jwt = require("jsonwebtoken");
 var _ = require("lodash");


 module.exports = function(moduleArg) {

    var {User} = moduleArg.dbModels;

    moduleArg.app.post("/api/login", function(req, res) {
        
        var body = _.pick(req.body, ["Username", "Password"]);
        new User({"Username":body.Username,"Password":body.Password}).fetch({columns:"id"}).then((user)=>{
            if(user == null) {
                res.status(401).send({success:false});
                return;
            }

            var token = createJWTToken(user.id, moduleArg.config.secret);
            res.header({"x-auth":token}).send({success:true});
        }).catch((err)=>{
            res.status(500).send("Error handleing the request");
            console.log(err);
        });
        
        
    });
//     /*moduleArg.app.get("/api/authservice/:token", function(req, res) {
//         var token = req.params.token;
//         jwt.verify(token, moduleArg.config.secret, function(err, decoded) {
//             if(err) {
//                 res.status(400).end("Unauthorized");
//             }
//             else {
//             const sql = `SELECT id  FROM users WHERE id = ${decoded.userId}`;

//             moduleArg.con.query(sql, function (err, result) {
//                 if (err)
//                     res.status(500).end("Internal error");
//                 else {
//                     if(result.length > 0)
//                         res.status(202).end("");
//                 }
//             });
//             }
//         });
//     });*/
 }

 function createJWTToken(id, key) {
    var data = {
        id
    };

    var token = jwt.sign(data,key);
    return token;
}