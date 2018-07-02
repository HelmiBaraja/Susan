const random = Math.round(Math.random());
const arr = ['Please input the amount that you want to transfer', 'Type the transfer amount'];

function inputTransferAmount (sendMessage, accountNo, data) {
    data.accountNo = accountNo;
    sendMessage(arr[random]);
    return data;
}

module.exports = inputTransferAmount;
