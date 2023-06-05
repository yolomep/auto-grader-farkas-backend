var express = require("express");
var router = express.Router();

const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")
var ObjectId = require('mongodb').ObjectId;
router.use(express.json());

//this api should change the current question of the problem
/** 
 * SO what should this route do? CRUD or ACER
 * Given a response which could be:
 * {action: "create", backgroundinfo, question} -> generates unique id?
 * {action: "read", _id} //backgroundinfo, question} gives two things
 * {action: "update", _id, backgroundinfo, question} if exists, change it
 * {action: "delete", _id} -> deletes by id
*/

router.post("/", async function (req, res) {
    await client.connect();
    //console.log(req.body.token);
    const question = client.db("local").collection('question');
    switch (req.body.action) {
        case "create":
            await question.insertOne({ background_info: req.body.background_info, question: req.body.question })
            res.send({success: true});
            break;
        case "read":
            res.send(await question.findOne({_id: new ObjectId(req.body._id)}))
            break;
        case "update":
            const response = await question.updateOne({_id: new ObjectId(req.body._id)}, {background_info: req.body.background_info, question: req.body.question})
            res.send({success: response.acknowledged});
            break;
        case "delete":
            response = await question.remove({_id: new ObjectId(req.body._id)}, {background_info: req.body.background_info, question: req.body.question})
            res.send({success: response.acknowledged});
            break;
        case "readAll":
            res.send(await question.find().toArray());
            break;
    }
    await client.close();
    
    
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
