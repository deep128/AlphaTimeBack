const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/ClassTime", (err, database)=>{
    if(err) {
        throw "Unable to connect to database";
    }

    console.log("Connected to database");
    db = database.db("ClassTime");
    db.collection('users').insertOne({
        name: 'Deepak Mishra',
        age: 24
    }, (err, result) => {
        if(err) {
            return console.log("Unable to insert: ", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    database.close();
});