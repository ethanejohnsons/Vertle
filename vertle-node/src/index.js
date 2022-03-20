const express = require('express');
const app = express();

function getAnswerOfTheDay() {
    return 0b111000000000000;
}

const server = app.listen(4000, () => {
    const host = server.address().address;
    const port = server.address().port
    console.log("Vertle API listening at http://%s:%s", host, port);
});

app.get('/daily', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify({
        answer: getAnswerOfTheDay().toString(2),
        vertices: 6
    }));
});