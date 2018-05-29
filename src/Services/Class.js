// Module

_ = require("lodash");

module.exports = function(moduleArg) {

    const con = moduleArg.con;
    const app = moduleArg.app;
    sqlquery = moduleArg.sqlquery;

    app.get("/classesbyschool",(req , res)=>{

        const schoolid = req.query.schoolid;
        const userid = req.data.userid;
        
        var sql = `SELECT class.*, user.username AS classteacherusername, CONCAT(user.firstname, ' ', user.lastname) AS classteachername FROM class
        LEFT JOIN user ON class.classteacherid = user.id
        WHERE class.schoolid = ${schoolid}
        ORDER BY class.level, class.name`;
        sqlquery(sql, (result,fields)=>{
            if(result.length > 0) {
                res.send({
                    classes:result,
                    success: true
                });
            }
            else {
                res.send({
                    msg: "Not found",
                    success: false
                });
            }
        });
    });

    app.post("/saveclass",(req,res)=>{
        const userid = req.data.userid;
        const vclass = _.pick(req.body,["id","name","level","schoolid"]);
        var sql = `INSERT INTO class (name,level,schoolid) values('${vclass.name}',${vclass.level},${vclass.schoolid})`;
        sqlquery(sql,(result,fields)=>{
            console.log("result: ",result);
            res.send({
                success:true
            });
        });
    });

}