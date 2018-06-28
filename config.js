var checkBalance = require('./checkBalance');
var checkPassword = require('./checkPassword');

var config = {
    event: {
        checkBalance: {
            texts: ['Please input your account no', 'Type your account number'],
            func: checkPassword,
            hasNext: 'printBalance'
        },
        printBalance: {
            texts: [],
            func: checkBalance,
            hasNext: null
        }
    }
};

module.exports = config;