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

//app.use(express.static(__dirname + '/UI_SusanTalk/views'));
//app.use(express.static(__dirname + '/UI_SusanTalk/public'));

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

    socket.on('getLoginStatus', () => {
        socket.emit('loginStatus', data.auth.isLogin);
    });

    /* BYPASS Without Login*/
    socket.on('bypasslogin', () => {
        data.auth.isLogin = true;
        socket.emit('bypass', data.auth.isLogin);
    });
});
