const request = require('request');

function getForexResult (msg, sendMessage) {
    const messages = msg.split(' ');
    const amount = messages[1];
    const base = messages[2];
    const target = messages[4].substring(0, 3);
    let baseVal = 0;
    let targetVal = 0;
    let result = 0;

    request(`http://data.fixer.io/api/latest?access_key=bae0a624b0054330eedbeff6663fc734&symbols=${base},${target}`,
        { json: true }, (err, res, data) => {
            baseVal = data.rates[base];
            targetVal = data.rates[target];
            result = parseFloat(amount * (targetVal / baseVal)).toFixed(2);

            sendMessage(amount + " " + base + " is equals " + result + " " + target);
        });
}

module.exports = getForexResult;