// Module

module.exports = function(moduleArg) {

    const con = moduleArg.con;

    moduleArg.app.get("/classesbyschool",(req , res)=>{

        const schoolid = req.query.schoolid;
        const userid = req.data.userid;
        
        var sql = `SELECT class.*, user.username AS classteacherusername, CONCAT(user.firstname, ' ', user.lastname) AS classteachername FROM class
        LEFT JOIN user ON class.classteacherid = user.id
        WHERE class.schoolid = ${schoolid}`;
        moduleArg.sqlquery(sql, (result,fields)=>{
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


    function getSchool(schoolid, res) {
        new School({"id":schoolid}).fetch({
            columns:["name"],
            withRelated:["principle", "principle.user_profile"]
        }).then(school=>{
            console.log(school);
            console.log(school.relations.principle.relatedData);
            res.status(200).send();
        }).catch(err=>{
            moduleArg.myUtils.logError(err);
        });;
    }

}