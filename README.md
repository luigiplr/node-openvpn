node-openvpn
--------------

[![npm version](https://badge.fury.io/js/node-openvpn.svg)](http://badge.fury.io/js/node-openvpn)



 Communicate to an OpenVpn client instance via telenet, for [node](http://nodejs.org).

  

```js
	var openvpnmanager = require('node-openvpn');
    
	var opts = {
        host: '127.0.0.1', // normally '127.0.0.1', will default to if undefined 
        port: 1337, //port openvpn management console
        timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
        logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute 
    };
    var auth = {
        user: 'vpnUserName', 
        pass: 'vpnPassword', 
    };

    var openvpn = openvpnmanager.connect(opts)

    openvpn.on('connected', function(output) { //will be emited on successful interfacing with openvpn instance
        openvpnmanager.authorize(auth);
    });

    openvpn.on('authorized', function(output) { //will be emited on successful connection of vpn. 
        console.log('yay we have connected.');
    });

    openvpn.on('console-output', function(output) { //emits console output of openvpn instance as a array
        console.log(output)
    });
    
    openvpnmanager.getLog(console.log) //get all console logs up to this point
    
    
```

## Installation

```bash
$ npm install node-openvpn
```

