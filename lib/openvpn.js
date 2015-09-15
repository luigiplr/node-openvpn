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

module.exports.destroy = function() {
    console.log(connection);
    connection.removeAllListeners();
    connection = new telnet();
}

module.exports.connect = function(params) {

    establishConnection(params)
        .then(function() {
            return OpenVPNManagement('hold release');
        })
        .then(function() {
            openvpnEmitter.emit('connected');
        })
        .then(OpenVPNLog);

    return openvpnEmitter
}
module.exports.authorize = function(auth) {
    return OpenVPNManagement(util.format('username "Auth" "%s"', auth.user))
        .then(function() {
            OpenVPNManagement(util.format('password "Auth" "%s"', auth.pass));
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
        connection.exec('state on', function(logsResponse) {
            connection.on('console-output', function(response) {

              _.each(response.split("\n"), function(res) {
                if (res && res.substr(1, 5) == 'STATE') {
                  openvpnEmitter.emit('state-change', res.substr(7).split(","));
                } else {
                  openvpnEmitter.emit('console-output', res);
                }
              });

            });
        });
    });
}
