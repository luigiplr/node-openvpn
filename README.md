node-openvpn
============
[![NPM version](https://badge.fury.io/js/node-openvpn.svg)](http://badge.fury.io/js/node-openvpn)
[![Dependency Status](https://img.shields.io/david/luigiplr/node-openvpn.svg)](https://david-dm.org/luigiplr/node-openvpn)
[![npm](https://img.shields.io/npm/dm/node-openvpn.svg?maxAge=2592000)]()

Communicate with an OpenVPN client instance via telnet using [node](http://nodejs.org).

## Installation
```bash
$ npm install node-openvpn --save
```

## Usage
```js
const openvpnmanager = require('node-openvpn');

const opts = {
  host: '127.0.0.1', // normally '127.0.0.1', will default to if undefined
  port: 1337, //port openvpn management console
  timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
  logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute
};
const auth = {
  user: 'vpnUserName',
  pass: 'vpnPassword',
};
const openvpn = openvpnmanager.connect(opts)

// will be emited on successful interfacing with openvpn instance
openvpn.on('connected', () => {
  openvpnmanager.authorize(auth);
});

// emits console output of openvpn instance as a string
openvpn.on('console-output', output => {
  console.log(output)
});

// emits console output of openvpn state as a array
openvpn.on('state-change', state => {
  console.log(state)
});

// emits console output of openvpn state as a string
openvpn.on('error', error => {
  console.log(error)
});

// get all console logs up to this point
openvpnmanager.getLog(console.log)

// and finally when/if you want to
openvpnmanager.disconnect();

// emits on disconnect
openvpn.on('disconnected', () => {
  // finally destroy the disconnected manager 
  openvpnmanager.destroy()
});
```
