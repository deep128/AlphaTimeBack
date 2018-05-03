// Module

module.exports = function(moduleArg) {
    
    var {User} = moduleArg.dbModels;

    moduleArg.app.get('/user',(req,res)=>{
        const userid = req.data.userid;
        getUserResponse({"id":userid}, res)
    });

    moduleArg.app.get('/users');

    function getUserResponse(condition, res) {

        new User(condition).fetchAll({columns:["id","username","email","firstname","lastname"]}).then((user)=>{
            if(user == null) {
                res.status(400).end();
                return;
            
            }
            res.status(200).send(setUserValues(user));
        }).catch((err)=>{
            console.log(err);
            res.status(500).send("Error handleing the request");
        });
    
    }

}

function setUserValues(user) {
    return {
        user:{
            userId:user.id,
            firstName: user.attributes.firstname,
            lastName: user.attributes.lastname,
            userName: user.attributes.username,
            gender: "male",
            profile_pic: "",
            cover_pic: "",
            covTop: 0
        }
    };
}