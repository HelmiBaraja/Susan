/* var readline = require('readline'),
    color = require("ansi-color").set;
var getChatName = color("<Susan> ", "cyan");
var getCustName = color("<You> ", "green");
var sleep = require('sleep');
var apiai = require('apiai');
var app = apiai("e925d19e5368410babf3cf3b663b9996");
var unixTime = require('unix-time');
var config = require('./config');
var getForexResult = require('./getForexResult');
var request;
var isMatch = false;
var matchedData = null;

// var rl = readline.createInterface(process.stdin, process.stdout, "OHAI>");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: getCustName
});

bill_reply("Waking up .... ");
sleep.sleep(3)
bill_reply("Could you wait please dear, let me put some makeup :) ");
sleep.sleep(3)
bill_reply(".");
sleep.sleep(1)
bill_reply("..");
sleep.sleep(1)
bill_reply("...");
sleep.sleep(4)
bill_reply("For now, you have to login first. Please type your username");
// console.log("<You>");

function console_out (msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

var data = {
    transfer: {
        accountNo: '',
        accountName: '',
        amount: 0
    },
    auth: {
        isUsernameTyped: true,
        isPasswordTyped: false,
        isLogin: false
    }
};

rl.on('line', function (msg) {
    if (msg === '') {
        bill_reply('Please do not type empty words, dear :)');
        return;
    }

    if (data.auth.isUsernameTyped && !data.auth.isPasswordTyped && msg !== 'admin' && !data.auth.isLogin) {
        bill_reply('Username is wrong, dear :) Please type your username again');
        data.auth.isUsernameTyped = true;
        return;
    }

    if (!data.auth.isUsernameTyped && !data.auth.isLogin) {
        bill_reply('You have to login first, dear :) Please type your username');
        data.auth.isUsernameTyped = true;
        return;
    }

    if (!data.auth.isPasswordTyped && !data.auth.isLogin) {
        bill_reply('Please type your password too');
        data.auth.isPasswordTyped = true;
        return;
    }

    if (data.auth.isPasswordTyped && msg !== 'admin' && !data.auth.isLogin) {
        bill_reply('Password is wrong, dear :) Please type your password again');
        data.auth.isPasswordTyped = true;
        return;
    }

    if (data.auth.isUsernameTyped && data.auth.isPasswordTyped && !data.auth.isLogin) {
        bill_reply("Yes dear, How can I help you now ? You can ask me about your balance, transaction history, fund transfer, and current rate");
        data.auth.isLogin = true;
        return;
    }

    if (!isMatch) {
        request = app.textRequest(msg, {
            sessionId: unixTime(new Date()) + ''
        });

        request.on('response', function (response) {
            var event = config.event;
            var speech = response.result.fulfillment.speech;
            var intentName = response.result.metadata.intentName;

            Object.keys(event).forEach(function (key) {
                var data = event[key];
                const isExists = data.texts.indexOf(speech) > -1;
                if (isExists) {
                    isMatch = true;
                    matchedData = data;
                }
            });

            console_out(getChatName + " : " + response.result.fulfillment.speech);

            if (intentName === 'forex-input' && speech.includes('Converting')) {
                getForexResult(speech, console_out, getChatName);
            }

            if (intentName === 'logout') {
                data.auth = {
                    isUsernameTyped: false,
                    isPasswordTyped: false,
                    isLogin: false
                };
            }
        });

        request.on('error', function (error) {
            console_out(getChatName + " : " + response);
        });

        request.end();
    } else {
        if (!data[matchedData.dataType]) {
            matchedData.func(getChatName, console_out);
        } else {
            data[matchedData.dataType] = matchedData.func(getChatName, console_out, msg, data[matchedData.dataType]);
        }

        isMatch = !!matchedData.hasNext;

        if (isMatch) {
            matchedData = config.event[matchedData.hasNext];
        }
    }
});

function bill_reply (msg) {
    console_out(getChatName + " : " + msg);
}

function cust_question (msg) {
    console_out(getCustName + " : " + msg);
}
*/

'use strict';

require('dotenv').config()
const config = require('./config');
const getForexResult = require('./getForexResult');
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/UI_InputUser/views'));
app.use(express.static(__dirname + '/UI_InputUser/public'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);
let isMatch = false;
let matchedData = null;
let data = {
    transfer: {
        accountNo: '',
        accountName: '',
        amount: 0
    },
    auth: {
        isUsernameTyped: true,
        isPasswordTyped: false,
        isLogin: false
    }
};

// Web UI
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

let socketSend = null;

const sendMessage = (text, responseAPI) => {
    return socketSend.emit('bot reply', {
        text,
        responseAPI
    });
}

io.on('connection', function (socket) {
    socketSend = socket;
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);

        if (text === '') {
            return sendMessage('Please do not type empty words, dear :)');
        }

        if (data.auth.isUsernameTyped && !data.auth.isPasswordTyped && text !== 'admin' && !data.auth.isLogin) {
            data.auth.isUsernameTyped = true;
            return sendMessage('Username is wrong, dear :) Please type your username again');
        }

        if (!data.auth.isUsernameTyped && !data.auth.isLogin) {
            data.auth.isUsernameTyped = true;
            return sendMessage('You have to login first, dear :) Please type your username');
        }

        if (!data.auth.isPasswordTyped && !data.auth.isLogin) {
            data.auth.isPasswordTyped = true;
            return sendMessage('Please type your password too');
        }

        if (data.auth.isPasswordTyped && text !== 'admin' && !data.auth.isLogin) {
            data.auth.isPasswordTyped = true;
            return sendMessage('Password is wrong, dear :) Please type your password again');
        }

        if (data.auth.isUsernameTyped && data.auth.isPasswordTyped && !data.auth.isLogin) {
            data.auth.isLogin = true;
            return sendMessage('Yes dear, How can I help you now ? You can ask me about your balance, transaction history, fund transfer, and current rate');
        }

        // Get a reply from API.ai

        if (!isMatch) {
            let apiaiReq = apiai.textRequest(text, {
                sessionId: APIAI_SESSION_ID
            });

            apiaiReq.on('response', (response) => {
                var event = config.event;
                var speech = response.result.fulfillment.speech;
                var intentName = response.result.metadata.intentName;

                Object.keys(event).forEach(function (key) {
                    var data = event[key];
                    const isExists = data.texts.indexOf(speech) > -1;
                    if (isExists) {
                        isMatch = true;
                        matchedData = data;
                    }
                });

                console.log('Bot reply: ' + speech);
                sendMessage(speech, response);

                if (intentName === 'forex-input' && speech.includes('Converting')) {
                    getForexResult(speech, sendMessage);
                }

                if (intentName === 'logout') {
                    data.auth = {
                        isUsernameTyped: false,
                        isPasswordTyped: false,
                        isLogin: false
                    };
                }
            });

            apiaiReq.on('error', (error) => {
                console.log(error);
            });

            apiaiReq.end();
        } else {
            data[matchedData.dataType] = matchedData.func(sendMessage, text, data[matchedData.dataType]);

            isMatch = !!matchedData.hasNext;

            if (isMatch) {
                matchedData = config.event[matchedData.hasNext];
            }
        }
    });
});
