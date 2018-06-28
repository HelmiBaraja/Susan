var printBalance = require('./printBalance');
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
            func: printBalance,
            hasNext: null
        }
    }
};

module.exports = config;