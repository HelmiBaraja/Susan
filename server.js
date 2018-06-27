var readline = require('readline'),
    color = require("ansi-color").set;
var getChatName = color("<Susan> ", "cyan");
var getCustName = color("<You> ", "green");
var sleep = require('sleep');
var apiai = require('apiai');
var app = apiai("e925d19e5368410babf3cf3b663b9996");
var unixTime = require('unix-time');

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
bill_reply("Yes dear, How can I help you now ?");
// console.log("<You>");

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

rl.on('line', function(msg) {
    var request = app.textRequest(msg, {
        sessionId: unixTime(new Date())+''
    });
    request.on('response', function(response) {
        console_out(getChatName + " : " + response.result.fulfillment.speech);
    });

    request.on('error', function(error) {
        console_out(getChatName + " : " + response);
    });
    request.end();

});

function bill_reply(msg) {

    console_out(getChatName + " : " + msg);
}

function cust_question(msg) {

    console_out(getCustName + " : " + msg);
}