const random = Math.round(Math.random());
const arr = ['Please input the amount that you want to transfer', 'Type the transfer amount'];

function inputTransferAmount (getChatName, console_out, accountNo, data) {
    data.accountNo = accountNo;
    console_out(getChatName + " : " + arr[random]);
    return data;
}

module.exports = inputTransferAmount;
