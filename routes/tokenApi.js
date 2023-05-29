var express = require("express");
var router = express.Router();

const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")

/**
 * Loginjs: Reads from MongoDB with login info and returns tokens. 
 * MongoDB should have users: type, username, password
 * API should check if user is there then send a JWT key when user logs in
 * the key can be decrypted using another API to retrieve login info
 * 
 * Another MongoDB should have the list of questions in array form
 * 
 * Another MongoDB should contain student responses to the questions per question? per assignment?
 */


router.use(express.json());
// router.use("/", function(req, res, next) {
//   //console.log(req);
//   console.log("using");
//   next();
// });


//result should be in the form of {authenticated: bool, type: "student" | "teacher"}
router.post("/", async function (req, res) {
    await client.connect();
    const login = client.db("local").collection('login');
    for await (const result of login.find({"_id": new ObjectId(req.body.token)})) {
        console.log(result);
        
    
        res.send({
          authenticated: true,
          type: result.type
        });
        await client.close();
        return;
      }
    
    res.send({authenticated: false})
    
});

module.exports = router;
