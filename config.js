var printBalance = require('./printBalance');
var checkPassword = require('./checkPassword');
var inputTransferAmount = require('./inputTransferAmount');
var printTransferProof = require('./printTransferProof');
var checkTransferAccountNo = require('./checkTransferAccountNo');

var config = {
    event: {
        checkBalance: {
            texts: ['Please input your account no', 'Type your account number'],
            func: checkPassword,
            hasNext: 'printBalance'
        },
        printBalance: {
            texts: [],
            func: printBalance,
            hasNext: null
        },
        checkTransferAccountName: {
            texts: ['Can u give me the account name you want to transfer?', 'Please type the account name you want to transfer, dear :)'],
            func: checkTransferAccountNo,
            hasNext: 'inputTransferAmount',
            dataType: 'transfer'
        },
        inputTransferAmount: {
            texts: [],
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