var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var getPort = require('get-port');
var _ = require('lodash');


var connection = new telnet(),
    port;


module.exports.connect = function(params) {
    return new Promise(function(resolve, reject) {
        Promise.promisify(getPort)
            .spread(function(e, p) {
                port = p;
                return params;
            })
            .then(establishConnection)
            .catch(reject);
    });
}


function establishConnection(params) {

    params = _.defaults(params, {
        host: '127.0.0.1',
        port: port,
        shellPrompt: '/ # ',
        timeout: 1500
    });

    connection.connect(params);

    return new Promise(function(resolve, reject) {
        connection.on('ready', function(prompt) {
            resolve();
        });
        connection.on('timeout', function() {
            console.log('socket timeout!')
            reject();
        });
    });
}

function disconnectOpenVPN() {
    return new Promise(function(resolve, reject) {
        OpenVPNManagement('signal SIGTERM').then(resolve).catch(reject);
    });
}


function OpenVPNManagement(cmd) {
    return new Promise(function(resolve, reject) {
        connection.exec(cmd, function(response) {
            console.log(response);
            resolve(response);
        });
    });
}