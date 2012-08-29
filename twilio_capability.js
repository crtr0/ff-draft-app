/* 
 * twilio-capability
 * 
 * Simple module for generating Twilio Client capability tokens for Node.js
 *
 * Based on twilio.js by Matt Robenolt
 * https://github.com/mattrobenolt/twilio-js 
 */

var jwt = require('jwt-simple');
var qs = require('querystring');

var ScopeURI = function(service, privilege, params) {
    this.service = service;
    this.privilege = privilege;
    this.params = params ?  qs.stringify(params) : false;
};

ScopeURI.prototype.toString = function() {
    var paramString = this.params ? '?'+this.params : '';
    return 'scope:'+this.service+':'+this.privilege+paramString;
};

var TwilioCapability = function(accountSid, authToken) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.capabilities = {};
};

TwilioCapability.prototype = {
    payload: function() {
        var scopeUris = [], key;
        for(key in this.capabilities)
        {
            if(this.capabilities.hasOwnProperty(key))
            {
                scopeUris.push(this.capabilities[key].toString());
            }
        }
        return {
            scope: scopeUris.join(' ')
        };
    },
    allowClientIncoming: function(clientName) {
        this.capabilities.incoming = new ScopeURI('client', 'incoming', {
            clientName: clientName
        });
    },

    allowClientOutgoing: function(applicationSid, clientName, kwargs) {
        var scopeParams = {
            appSid: applicationSid
        };
        if(clientName)
        {
            scopeParams.clientName = clientName;
        }
        if(kwargs)
        {
            scopeParams.appParams = qs.stringify(kwargs);
        }

        this.capabilities.outgoing = new ScopeURI('client', 'outgoing', scopeParams);
    },

    allowEventStream: function(kwargs) {
        var scopeParams = {
            path: '/2010-04-01/Events'
        };
        if(kwargs)
        {
            scopeParams.filters = qs.stringify(kwargs);
        }

        this.capabilities.events = new ScopeURI('stream', 'subscribe', scopeParams);
    },

    generate: function(expires) {
        var payload = this.payload(), token;
        payload.iss = this.accountSid;
        payload.exp = Math.round(new Date().getTime()/1000) + (expires || 3600);
        
        return jwt.encode(payload, this.authToken);
    }

};

module.exports = TwilioCapability;
