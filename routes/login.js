var express = require("express");
var router = express.Router();
const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")
//var main = require( './../dbconnect' );

//const { MongoClient } = require('mongodb');
router.use(express.json()); 
// router.use("/", function(req, res, next) {
//   next();
// });
//const client = new MongoClient("mongodb://127.0.0.1:27017/")
/*

 "name": "Farkas",
  "username": "jfarkas",
  "password": "I love APUSH",
  "type": "teacher"
  */


router.post("/", async function(req, res) {
  // console.log("smb express");
  // console.log(req.body);
  // res.send({
  //   token: 'test123'
  // });
  //console.log("get recieved! trying to connect");
  await client.connect();
  //console.log("connected");
  const login = client.db("local").collection('login');
  //{username: req.body.username, password: req.body.password}
  //console.log(req.body);
  for await (const result of login.find({username: req.body.username, password: req.body.password})) {
    //console.log(result);
    

    res.send({
      token: result._id.toString(),
      userType: result.type
    });
    await client.close();
    return;
  }


    
  
  //console.log("Done");
  await client.close();
  res.send({token: null, userType: false});
  
});

module.exports = router;
