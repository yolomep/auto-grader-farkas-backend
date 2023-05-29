import express from 'express';
var router = express.Router();

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
*/
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
