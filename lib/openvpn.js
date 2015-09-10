var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var _ = require('lodash');


var connection = new telnet(),
    port;


/*
 parms object should look like the following: {
        host: yourhost normally '127.0.0.1',
        port: port openvpn management is running on,
        timeout: 1500, //timeout for connection - optional 
        username: vpnusername, //optional
        password: vpnpassword, //optional, 
        config: path to vpn config //can be absolute or relative 
    }
*/


module.exports.connect = function(params) {
    return new Promise(function(resolve, reject) {
        establishConnection(params)
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

function establishConnection(params) {

    params = _.defaults(params, {
        host: '127.0.0.1',
        port: 1337,
        shellPrompt: '/ # ',
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