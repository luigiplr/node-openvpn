var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var _ = require('lodash');
var util = require('util');


var connection = new telnet(),
    port;


module.exports.connect = function(auth, params) {
    return new Promise(function(resolve, reject) {
        establishConnection(auth, params)
            .then(function() {
                resolve('ready');
            })
            .catch(reject);
    });
}

module.exports.disconnect = function() {
    return disconnectOpenVPN();
}

module.exports.cmd = function(cmd) {
    return OpenVPNManagement(cmd);
}

function establishConnection(auth, params) {

    if (auth.user && auth.pass)
        var cmd = util.format('hold release \n username "Auth" "%s" \n password "Auth" "%s"', args.user, auth.pass);
    else
        var cmd = '/ # ';

    params = _.defaults(params, {
        host: '127.0.0.1',
        port: 1337,
        shellPrompt: cmd,
        timeout: 1500
    });

    connection.connect(params);

    return new Promise(function(resolve, reject) {
        connection.on('ready', function(prompt) {
            resolve();
        });
        connection.on('timeout', function() {
            reject();
        });
    });
}

function disconnectOpenVPN() {
    return OpenVPNManagement('signal SIGTERM');
}

function OpenVPNManagement(cmd) {
    return new Promise(function(resolve, reject) {
        try {
            connection.exec(cmd, function(response) {
                resolve(response);
            });
        } catch (e) {
            reject(e);
        }
    });
}