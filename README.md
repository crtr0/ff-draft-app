Fantasy Football Draft Room
===========================

Hey sports fans, welcome to my latest Node.js experiment.  This application is an example of how you can use [Twilio Client][1] to easily provision and spin-up online conference rooms. The hosted version of the [Twilio Fantasy Football Draft Room][2] is hosted at [Nodejitsu][3].

How You Can Play
----------------
1. Create a new Twilio TwiML application (note the Application ID)
2. Rename `config.sample.js` to `config.js`
3. Configure your Twilio & Redis credentials
4. Deploy
5. Point your TwiML application's voiceURL at http://yourdomain/voice
6. Done!

Capability Tokens in Node.js
----------------------------
Twilio Client is predicated on the generation of [capability tokens][4].  All of the official Twilio helper libraries include code to generate these tokens, but there is currently no official helper library for Node.js.  This project includes `twilio_capability.js` which is based on Matt Robenolt's [twilio-js library][5] and Kazuhito Hokamura's [node-simple-jwt][6].

[1]: http://twilio.com/client
[2]: http://fantasyfootball.twilio.ly/
[3]: http://nodejitsu.com
[4]: http://www.twilio.com/docs/client/capability-tokens
[5]: https://github.com/mattrobenolt/twilio-js 
[6]: https://github.com/hokaccha/node-jwt-simple
