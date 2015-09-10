var Promise = require('bluebird');
var telnet = require('telnet-client');
var fs = require('fs');
var _ = require('lodash');


var connection = new telnet(),
    port;


/**
 * @method connect
 * @param {Object} params
 * @return NewExpression
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

/**
 * Description
 * @method disconnect
 * @return CallExpression
 */
module.exports.disconnect = function() {
    return disconnectOpenVPN();
}

/**
 * Description
 * @method cmd
 * @param {String} cmd
 * @return CallExpression
 */
module.exports.cmd = function(cmd) {
    return OpenVPNManagement(cmd);
}

/**
 * Description
 * @method establishConnection
 * @param {Object} params
 * @return NewExpression
 */
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

/**
 * Description
 * @method disconnectOpenVPN
 * @return CallExpression
 */
function disconnectOpenVPN() {
    return OpenVPNManagement('signal SIGTERM');
}

/**
 * Description
 * @method OpenVPNManagement
 * @param {} cmd
 * @return NewExpression
 */
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