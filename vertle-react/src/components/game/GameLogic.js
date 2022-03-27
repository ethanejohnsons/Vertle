import moment from "moment";

const { server, devServer, isDev } = require('../../config.json');

export async function getDailyAnswer() {
    let promise = await fetch(`${isDev ? devServer : server}/daily?date=${moment().format('YYYY-MM-DD')}`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    });

    return promise.json();
}