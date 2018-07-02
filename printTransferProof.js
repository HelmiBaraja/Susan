function getPrintText (data) {
    return 'Congrats! You have successfully transferred to ' + data.accountNo + ' by ' + data.amount + ' :)';
}

function printTransferProof (sendMessage, amount, data) {
    data.amount = amount;
    sendMessage(getPrintText(data));
    data = {
        accountNo: '',
        accountName: '',
        amount: 0
    };

    return data;
}

module.exports = printTransferProof;
