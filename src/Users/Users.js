// Module

module.exports = function(moduleArg) {
    
    var {User} = moduleArg.dbModels;

    moduleArg.app.get('/user',(req,res)=>{
        const userid = req.data.userid;
        getUserResponse({"id":userid}, res)
    });

    moduleArg.app.get('/usersByUsername',(req,res)=>{
        var usernameList = JSON.parse(req.query.usernameList);
        User.forge().query(function(qb) {
            qb.where("username", "IN", usernameList);
        })
        .fetchAll(
            {columns:["id","username","email","firstname","lastname"],
            withRelated:["user_profile"]
        }).then((users)=> {
            var response = [];
            users.models.forEach(user => {
                response.push(setUserValues(user));
            });;
            res.status(200).send(response);
        },err => {
            moduleArg.myUtils.logError(err);
            res.status("500").send("Internal Error");
        });
    });

    function getUserResponse(condition, res) {

        new User(condition).fetch({
            columns:["id","username","email","firstname","lastname"],
            withRelated:['user_profile']
        }).then((user)=>{
            if(user == null) {
                res.status(400).end();
                return;
            
            }
            res.status(200).send(setUserValues(user));
        }).catch((err)=>{
            moduleArg.myUtils.logError(err);
            res.status(500).send("Error handleing the request");
        });
    
    }

}

function setUserValues(user) {
    const user_profile = user.relations.user_profile.attributes;
    return {
        user:{
            userId:user.id,
            firstName: user.attributes.firstname,
            lastName: user.attributes.lastname,
            userName: user.attributes.username,
            gender: "male",
            profile_pic: user_profile.profile_pic,
            cover_pic: user_profile.cover_pic,
            covTop: 0
        }
    };
}