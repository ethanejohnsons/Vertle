const express = require('express');
const fs = require('fs');
const url = require('url');
const helmet = require('helmet');
const { simple, moderate, complex }= require('./config.json');

const app = express();
app.use(helmet());

const historyCache = loadHistory('history.json');

/**
 * Loads or creates the history file.
 * @param fileName the name of the history file
 * @returns {*[]|any}
 */
function loadHistory(fileName) {
    try {
        return JSON.parse(fs.readFileSync(fileName));
    } catch {
        fs.writeFileSync(fileName, "[]");
        return [];
    }
}

/**
 * Writes the history cache to disk.
 * @param fileName the name of the history file
 */
function writeHistory(fileName) {
    try {
        fs.writeFileSync(fileName, JSON.stringify(historyCache));
    } catch(err) {
        console.log(err);
    }
}

function getAnswer(today) {
    if (!today) {
        today = new Date().toISOString().slice(0, 10);
    }

    const generateAnswerOfTheDay = (n) => {
        return (Math.floor(Math.random() * Math.pow(2, n))).toString(2).padStart(n, "0");
    }

    for (let i = 0; i < historyCache.length; i++) {
        if (historyCache[i].date === today.toString()) {
            return historyCache[i];
        }
    }

    let answer = {
        gameNumber: historyCache.length + 1,
        date: today,
        simpleAnswer: generateAnswerOfTheDay(simple),
        moderateAnswer: generateAnswerOfTheDay(moderate),
        complexAnswer: generateAnswerOfTheDay(complex)
    };

    historyCache.push(answer);
    writeHistory('history.json');
    return answer;
}

const server = app.listen(4000, () => {
    const host = server.address().address;
    const port = server.address().port
    console.log("Vertle API listening at http://%s:%s", host, port);
});

app.get('/daily', (req, res) => {
    let data = url.parse(req.url, true).query;
    res.header("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(getAnswer(data.date)));
});
