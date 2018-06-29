var inputTransferAmount = require('./inputTransferAmount');
var printTransferProof = require('./printTransferProof');

var config = {
    event: {
        checkTransferAccountName: {
            texts: ['Can u give me the account no you want to transfer?', 'Please type the account number you want to transfer, dear :)'],
            func: inputTransferAmount,
            hasNext: 'printTransferProof',
            dataType: 'transfer'
        },
        printTransferProof: {
            texts: [],
            func: printTransferProof,
            hasNext: null,
            dataType: 'transfer'
        }
    }
};

module.exports = config;