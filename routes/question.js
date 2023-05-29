var express = require("express");
var router = express.Router();

const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")

router.use(express.json());

//this api should change the current question of the problem
router.post("/", async function (req, res) {
    await client.connect();
    console.log(req.body.token);
    const question = client.db("local").collection('question');
    question.insertOne({background: req.body.background, question: req.body.question})
    // for await (const result of login.find({"token": req.body.token})) {
    //     console.log(result);
        
    
    //     res.send({
    //       authenticated: true,
    //       type: result.type
    //     });
    //     await client.close();
    //     return;
    //   }
    
    // res.send({authenticated: false})
    
});

module.exports = router;
