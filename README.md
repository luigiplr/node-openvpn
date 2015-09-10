openvpn-client
--------------

[![npm version](https://badge.fury.io/js/node-openvpn.svg)](http://badge.fury.io/js/node-openvpn)

Communicate to an OpenVPN client instance via telenet

Installation
------------

``` 
npm install node-openvpn --save
```

Documentation
-------------

* [Class: OpenVPNClient](#openvpnclient)
  * [Constructor([auth])](#openvpnclient_authconstructor)
  * [Constructor([vpnOpts])](#openvpnclient_constructor)
  * [Constructor([cmd])](#openvpnclientcmd_constructor)
  * [.connect()](#openvpnclient_connect)
  * [.cmd()](#openvpnclient_cmd)
  * [.disconnect()](#openvpnclient_disconnect)
* [vpnclient.defaultOpts](#module_defaultOpts)
* [vpnclient.connect([vpnOpts])](#module_connect)


<a name="openvpnclient_constructor"></a>
#### Constructor

Argument: **vpnOpts** Object passed to .connect()

```
{
 host: '127.0.0.1', // normally '127.0.0.1',
 port: 1337, //port openvpn management is running on
 timeout: 1500 //timeout for connection - optional, will default to 1500ms if undefined
}
```

<a name="openvpnclient_authconstructor"></a>
#### Constructor

Argument: **auth** Object containing User/Pass for authorization

```
{
 user: 'vpnusername',
 pass:  'vpnpassword',
}
```


<a name="openvpnclient_connect"></a>
#### .connect()

It returns a Promise that is fulfilled when
"Inititialization Sequence Completed" message is received from the server.

 
<a name="openvpnclient_disconnect"></a>
It returns a Promise that is fulfilled when disconnected

<a name="openvpnclientcmd_constructor"></a>
#### Constructor

Argument: **cmd** String to be exsecuted by OpenVpn


<a name="openvpnclient_connect"></a>
#### .cmd()

Passes custom cmd to Open Vpn Instance, returns a Promise with responce

<a name="module_connect"></a>
### module.connect([auth], [vpnOpts]) 

It will setup authentication based on the first parameter.

<a name="module_cmd"></a>
### module.cmd([cmd]) 

Send command to OpenVpn Instance 

Support
-------

If you're having any problem, please [raise an issue](https://github.com/luigiplr/node-openvpn/issues/new) on GitHub and I'll  be happy to help.

Contribute
----------

- Issue Tracker: [github.com/luigiplr/node-openvpn/issues](https://github.com/luigiplr/node-openvpn/issues)
- Source Code: [github.com/luigiplr/node-openvpn](https://github.com/luigiplr/node-openvpn)



License
-------

The project is licensed under the GPL-3.0 license.
