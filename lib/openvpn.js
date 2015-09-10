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
                resolve();
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

    params = _.defaults(params, {
        host: '127.0.0.1',
        port: 1337,
        shellPrompt: '',
        timeout: 2
    });

    if (auth.user && auth.pass) {
        connection.connect(params);
        return OpenVPNManagement('hold release').then(function() {
            return OpenVPNManagement(util.format('username "Auth" "%s"', auth.user));
        }).then(function() {
            return OpenVPNManagement(util.format('password "Auth" "%s"', auth.pass));
        })
    } else {
        return connection.connect(params);
    }
}

function disconnectOpenVPN() {
    return OpenVPNManagement('signal SIGTERM');
}

function OpenVPNManagement(cmd) {
    return new Promise(function(resolve, reject) {
        resolve(connection.exec(cmd));
    });
}