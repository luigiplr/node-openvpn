var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var openvpnEmitter = new EventEmitter();
var connection = new telnet();
var log = null;
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
            if (params.logpath) {
                logpath = path.resolve(params.logpath);
                fs.writeFile(logpath, '', {
                    flags: 'wx'
                }, function(err) {
                    if (err) throw err;
                    OpenVPNLog();
                });
            } else
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

module.exports.getLog = function() {
    return log;
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

function OpenVPNLog(writetofile) {

    connection.exec('log on all', function(response) {
        if (!log) {
            log = response.split('\n');
        } else {
            var newlog = _.difference(response.split('\n'), log);
            log = log.concat(newlog);
            if (newlog.length > 0) {
                openvpnEmitter.emit('console-output', newlog);
                if (logpath !== null) {
                    fs.appendFile(logpath, newlog.join('\n'), function(err) {
                        if (err) throw err;
                    });
                }
            }
        }
        process.nextTick(OpenVPNLog);
    });
}

function searchStringInArray(str, strArray) {
    for (var j = 0; j < strArray.length; j++) {
        if (strArray[j].match(str)) return true;
    }
    return false;
}