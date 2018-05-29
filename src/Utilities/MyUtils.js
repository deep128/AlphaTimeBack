const fs = require("fs");
const path = require("path");

module.exports = function(config) {

    function logError(err,res) {
        logErrorS(err);
        res.status(500).send("Error handleing the request");
    }


    function logErrorS(err) {
        err = err.replace("\n","\r\n").replace("\r\r\n","\r\n") +
        "\r\n\r\n===========================================================\r\n\r\n";
        currDate = new Date();
        err = new Date() + "\r\n\r\n" + err;

        if(fs.existsSync(path.join(path.dirname(require.main.filename), config.urls.errorLogs))) {
            fs.appendFile(path.join(path.dirname(require.main.filename), config.urls.errorLogs),err,"utf-8",(err)=>{
                if(err != null) {
                    console.log(err.stack);
                }
            });
        }
        else {
            fs.writeFile(path.join(path.dirname(require.main.filename), config.urls.errorLogs),err,"utf-8",(err)=>{
                if(err != null) {
                    console.log(err.stack);
                }
            });   
        }
    }

    return {
        logError,
        logErrorS
    }
}