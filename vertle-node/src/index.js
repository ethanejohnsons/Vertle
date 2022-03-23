const express = require('express');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
app.use(helmet());

const historyFile = 'history.json';
let entryCache = null;

function generateAnswerOfTheDay(n) {
    return Math.floor(Math.random() * Math.pow(2, n));
}

function getAnswerOfTheDay() {
    let today = new Date().toISOString().slice(0, 10);

    if (entryCache && entryCache.date === today.toString()) {
        return entryCache;
    } else {
        let history = JSON.parse(fs.readFileSync(historyFile));

        if (history.length > 0 && history[history.length - 1].date === today.toString()) {
            entryCache = history[history.length - 1];
        } else {
            entryCache = {
                gameNumber: history.length + 1,
                date: today,
                answer: generateAnswerOfTheDay(15).toString(2),
                vertices: 6
            };

            history.push(entryCache);
            fs.writeFileSync(historyFile, JSON.stringify(history));
        }
    }

    return entryCache;
}

const server = app.listen(4000, () => {
    const host = server.address().address;
    const port = server.address().port
    console.log("Vertle API listening at http://%s:%s", host, port);
});

app.get('/daily', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(getAnswerOfTheDay()));
});
