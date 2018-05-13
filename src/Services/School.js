// Module

module.exports = function(moduleArg) {

    const con = moduleArg.con;

    moduleArg.app.get("/school",(req , res)=>{

        const schoolid = req.query.schoolid;
        const userid = req.data.userid;
        
        var sql = `SELECT school.id, name FROM school LEFT JOIN user_profile ON school.id = user_profile.schoolid WHERE `;
        if(schoolid == 0)
            sql += `user_profile.id = ${userid}`;
        else
            sql += `school.id = ${schoolid}`;
        con.query(sql,(err,result,fields)=>{
            if(err) {
                moduleArg.myUtils.logError(err, res);
                return;
            }
            else {
                if(result.length > 0) {
                    res.send({
                        school:{
                            id: result[0].id,
                            name: result[0].name
                        },
                        success: true
                    });
                }
                else {
                    res.send({
                        msg: "Not found",
                        success: false
                    });
                }
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