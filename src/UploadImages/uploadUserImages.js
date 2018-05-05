// Module

multer = require("multer");
path = require("path");
fs = require("fs");
uuid = require("uuid")

const DIR = path.join(path.dirname(require.main.filename) , "Images");

module.exports = function(moduleArg) {

    const {User_Profile} = moduleArg.dbModels;
    
    moduleArg.app.post("/uploadProfileImage",(req,res)=>{

        const userid = req.data.userid;

        var userImagesPath = path.join(DIR,"UsersImages");
        var upload = multer({dest: userImagesPath}).single("UploadFile");
        upload(req,res,(err) => {
            if(err) {
                console.log("Error", err);
                res.status(500).send("Internal Error");
                return;
            }
            var imageName = uuid.v4();
            const {fileType} = req.body;
            if(fileType == "image/jpeg") {
                imageName += ".jpg";
                fs.rename(req.file.path, path.join(userImagesPath,imageName), function (err) {
                    if (err) {
                        res.status(500).send("Internal Error");
                    }

                    new User_Profile({id: userid})
                    .save({profile_pic: imageName})
                    .then(()=>{
                        res.send({
                            success:true,
                            msg: "File Uploaded"
                        });
                    },(err)=>{
                        res.send({
                            success:false,
                            msg: "File type not suppoted"
                        });
                    });
                });
            }
            else {
                res.send({
                    success:false,
                    msg: "File type not suppoted"
                });
            }
        })
    });
}