const random = Math.round(Math.random());
const arr = ['Your balance is RM 1000', '1000 MYR is in your account, dear :)'];

function checkBalance (getChatName, console_out) {
    console_out(getChatName + " : " + arr[random]);
}

module.exports = checkBalance;
