var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var util = require('util');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var openvpnEmitter = new EventEmitter();
var connection = new telnet();
var logpath = null;
module.exports.connect = function(params) {

    establishConnection(params)
        .then(function() {
            return OpenVPNManagement('hold release');
        })
        .then(function() {
            openvpnEmitter.emit('connected');
        })
        .then(function() {
            OpenVPNLog();
        });
    return openvpnEmitter
}
module.exports.authorize = function(auth) {
    if (auth.user)
        OpenVPNManagement(util.format('username "Auth" "%s"', auth.user))
        .then(function() {
            if (auth.pass)
                OpenVPNManagement(util.format('password "Auth" "%s"', auth.pass));
        });
    else if (auth.pass)
        OpenVPNManagement(util.format('password "Auth" "%s"', auth.pass));

    return new Promise(function(resolve) {
        openvpnEmitter.on('console-output', function(output) {
            if (searchStringInArray('Initialization Sequence Completed', output)) {
                openvpnEmitter.emit('authorized');
                resolve(true);
            }
        });
    });
}

module.exports.disconnect = function() {
    return disconnectOpenVPN();
}

module.exports.cmd = function(cmd) {
    return OpenVPNManagement(cmd);
}

function establishConnection(params) {
    return new Promise(function(resolve) {
        params = _.defaults(params, {
            host: '127.0.0.1',
            port: 1337,
            shellPrompt: '',
            timeout: 2
        });
        resolve(connection.connect(params));
    });
}

function disconnectOpenVPN() {
    return OpenVPNManagement('signal SIGTERM').then(function() {
        openvpnEmitter.emit('disconnected');
    });
}

function OpenVPNManagement(cmd) {
    return new Promise(function(resolve, reject) {
        resolve(connection.exec(cmd));
    });
}

function OpenVPNLog() {
    connection.exec('log on all', function(logsResponse) {
        connection.on('console-output', function(response) {
          openvpnEmitter.emit('console-output', response);
        });
    });
}

function searchStringInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
        if (strArray[j].match(str)) return true;
    }
    return false;
}
