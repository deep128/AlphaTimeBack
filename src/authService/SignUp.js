// Module

module.exports = function(moduleArg) {
    moduleArg.app.post('/api/signup',function(req, res) {

        const sql = `Insert into users (Username, FirstName, LastName, Email, Gender, Password) values ('${req.body.username}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${req.body.gender=='male'?1:0}', '${req.body.password}')`;

        moduleArg.con.query(sql, function (err, result) {
            if (err) 
                console.log(err);
            else {
            res.status(201).send(JSON.stringify({
                    msg: "Inserted",
                    status: "300"
                }));
            }
          });
    });

    moduleArg.app.get('/api/signup/check/:entity',function(req,res) {
        var sql;
        if(req.params.entity == "username")
            sql = `SELECT id FROM users WHERE Username='${req.query.username}'`;
        else if(req.params.entity == "email")
            sql = `SELECT id FROM users WHERE Email='${req.query.email}'`;
        else {
            res.status(400);
            res.end("Bad request");
            return;
        }

        moduleArg.con.query(sql, function (err, result) {
            if (err) throw err;
            res.status(200);
            console.log(result);
            if(result.length > 0) {
                res.end(JSON.stringify({
                    msg: "User found",
                    status: "200"
                }));
            }
            else {
                res.end(JSON.stringify({
                    msg: "User not found",
                    status: "404"
                }));
            }
            
          });
    });
}