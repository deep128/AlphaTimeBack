// Module

module.exports = function(moduleArg) {

    var {User} = moduleArg.dbModels;

    moduleArg.app.get('/userProfileByUsername',(req,res)=>{
        var usernameList = JSON.parse(req.query.usernameList);
        User.forge().query(function(qb) {
            qb.where("username", "IN", usernameList);
        })
        .fetchAll(
            {columns:["id","username","email","firstname","lastname"],
            withRelated:["user_profile","school"]
        }).then((users)=> {
            var response = [];
            users.models.forEach(user => {
                response.push(setUserProfileValues(user));
            });;
            res.status(200).send(response);
        },err => {
            moduleArg.myUtils.logError(err);
            res.status("500").send("Internal Error");
        });
    });
    
}