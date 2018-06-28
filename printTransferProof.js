function getPrintText (data) {
    return 'Congrats! You have successfully transferred to ' + data.accountName + ' for ' + data.amount + ' :)';
}

function printTransferProof (getChatName, console_out, amount, data) {
    data.amount = amount;
    var text = getPrintText(data);
    console_out(getChatName + " : " + getPrintText(data));
    data = {
        accountNo: '',
        accountName: '',
        amount: 0
    };

    return data;
}

module.exports = printTransferProof;
