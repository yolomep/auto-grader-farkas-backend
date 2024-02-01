var express = require("express");
var router = express.Router();
const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")
router.use(express.json());
var ObjectId = require('mongodb').ObjectId;

// Key was public because its not mine - "fake" key
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "Find your own" //process.env.OPENAI_API_KEY, lolololol ~~public~~ for now
});
const openai = new OpenAIApi(configuration);

//should make a call to open ai for every response recieved?


/*
so what does the structure look like?
well we can have a document - of questions?
well we can have a document - of student
                                - with {question per response?}
each question should have three parts - background info, prompt

So this openai request - req should be:
{
    questionID: [questionID]
    students: [students]
}

response should be:
{
    questionID1: {student1: response, etc. },
    questionID2: {student1: response}, etc.
}
*/
router.post("/", async function (req, res) {
    //connect to client
    await client.connect();
    //get users database
    const login = client.db("local").collection('login');
    const questions = client.db("local").collection('question');
    var response = {};
    // req.body.students.forEach(x => new ObjectId(x));
    // req.body.question_id.forEach(x => new ObjectId(x));
    for (let index = 0; index < req.body.students.length; ++index) {
        req.body.students[index] = new ObjectId(req.body.students[index]);
    }
    for (let index = 0; index < req.body.question_id.length; ++index) {
        req.body.question_id[index] = new ObjectId(req.body.question_id[index]);
    }
    //console.log(Object.prototype.toString.call(req.body.students) === '[object Array]');
    for await (const student of login.find({ _id: { $in: req.body.students } })) {
        //console.log(student);
        var studentResponse = {};
        
        for await (const question of questions.find({ _id: { $in: req.body.question_id } })) {
            if(question._id in student.questions) {
                const result = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: question.background_info + student[question._id] + question.prompt,
                    temperature: 0,
                    max_tokens: 2000,
                });
                studentResponse[question._id] = result.data;
                console.log(result.data.choices);
                continue;
            }
            studentResponse[question._id] = "Student has not answered this question.";
        }
        response[student._id] = studentResponse;

    }
    console.log(response);
    res.send(response);
    await client.close();
    return;
});
module.exports = router;
