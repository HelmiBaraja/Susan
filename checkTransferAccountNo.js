const random = Math.round(Math.random());
const arr = ['Please input the account number', 'Type the account number'];

function checkTransferAccountNo (getChatName, console_out, accountName, data) {
    data.accountName = accountName;
    console_out(getChatName + " : " + arr[random]);
    return data;
}

module.exports = checkTransferAccountNo;
