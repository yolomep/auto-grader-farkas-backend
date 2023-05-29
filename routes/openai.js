var express = require("express");
var router = express.Router();
const { MongoClient } = require('mongodb');
//connect to database
const client = new MongoClient("mongodb://127.0.0.1:27017/")
router.use(express.json());

//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
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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" //process.env.OPENAI_API_KEY, lolololol public for now
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

    for await (const question of questions.find({ questionID: { $in: req.body.questionID } })) {
        //console.log(result);
        var questionResponse = {};
        for await (const student of login.find({ _id: { $in: req.body.students } })) {
            if(question.questionID in student) {
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: question.backgroundInfo + student[question.questionID] + question.prompt,
                    temperature: 0,
                    max_tokens: 2000,
                });
                questionResponse[student._id] = response;
                continue;
            }
            questionResponse[student._id] = "Student has not answered this question.";
        }
        response[question.questionID] = questionResponse;

    }
    res.send(response);
    await client.close();
    return;
});