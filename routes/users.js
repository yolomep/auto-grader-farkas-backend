var express = require("express");
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")
router.use(express.json());

/* POST users listing. */
/** 
 * SO what should this route do? CRUD or ACER
 * Given a response which could be:
 * {action: "create", studentName: "", studentUserName: "", studentPassword: ""} -> generates unique id?
 * {action: "read", _id} //studentName?, studentUserName?, studentPassword?} gives name and username
 * {action: "update", _id, studentName?, studentUserName?, studentPassword?} if exists, change it
 * {action: "delete", _id} -> deletes by id
 * 
 * 
name
"Farkas"
username
"jfarkas"
password
"I love APUSH"
type
"teacher"
*/
router.post('/', async function (req, res) {
    await client.connect();
    const users = client.db("local").collection('login');
    switch (req.body.action) {
        case "create":
            await users.insertOne({ name: req.body.student_name, username: req.body.student_username, password: req.body.student_password, type: "student" })
            res.send({ success: true });
            break;
        case "read":
            res.send(await users.findOne({ _id: new ObjectId(req.body._id) }))
            break;
        case "update":
            const response = await users.updateOne({ _id: new ObjectId(req.body._id) }, { name: req.body.student_name, username: req.body.student_username, password: req.body.student_password })
            res.send({ success: response.acknowledged });
            break;
        case "delete":
            response = await users.remove({ _id: new ObjectId(req.body._id) }, { name: req.body.student_name, username: req.body.student_username, password: req.body.student_password })
            res.send({ success: response.acknowledged });
            break;
        case "readAll":
            res.send(await users.find({ type: "student" }).toArray());
            break;
        case "updateQuestion":
            await users.updateOne({ _id: new ObjectId(req.body._id) }, {

                $set: {
                    questions: {
                        [req.body.question_id]: req.body.answer
                    }
                }

            })
            res.send({ success: "true" });
            break;
    }
    await client.close();
});

module.exports = router;
