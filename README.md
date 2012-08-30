Fantasy Football Draft Room
===========================

Hey sports fans, welcome to my latest Node.js experiment. Check out the hosted version of the [Twilio Fantasy Football Draft Room][2].

Features
--------
* Node.js Express - [Express 3.0][4] app configured to use [Hogan.js][5] templating
* Twilio Client - [Twilio Client][6] lets us easily spin-up conference rooms. Uses the [twilio-client-token][7] NPM module to generate the [capability tokens][8].
* Twilio Security - Uses the [twiliosig][9] NPM module to validate that [TwiML][10] requests are coming from Twilio.
* Redis Storage -  conference rooms codes are stored using [Redis][11]

Usage
-----
This app contains a single endpoint `/voice` for Twilio to use in setting-up your conference room.  The TwiML is defined in `views\voice.hjs` and is currently configured to support conference calls with a max of 14 participants and a max duration of 3 hours. You can easily edit this to your liking:
```xml
<Response>
  {{^digits}}
  <Say>Welcome to the Fantasy Football Draft Room</Say>
  <Pause length="1"/>
  <Say>Brought to you by Twilio</Say>
  <Pause length="1"/>
  {{/digits}}
  {{#id}}
  <Say>Connecting you to your conference now</Say>
  <Dial timeLimit="10800">
    <Conference maxParticipants="14" waitUrl="http://twimlets.com/holdmusic?Bucket=com.twilio.music.rock">{{id}}</Conference>
  </Dial>
  {{/id}}
  {{^id}}
  <Gather method="get" numDigits="4">
    <Say>Please enter your 4 digit code now</Say>
  </Gather>
  {{/id}}
</Response>
```

Installation
------------
Step-by-step instructions on getting this up and running:

1) Create free accounts on [Twilio][12], [Nodejitsu][12] and [RedisToGo][13] if you don't already have them. Nodejitsu and RedisToGo are optional, feel free to swap-in similar services.

2) Create a new Twilio TwiML application (note the Application ID)

3) Grab the latest source
```
git clone https://github.com/crabasa/ff-draft-app.git
```

4) Create your own config.js file
```
mv config.sample.js config.js
```

5) Edit config.js and configure your Twilio & Redis credentials

6) Edit package.json and set your own values for `subdomain` and `domains`

6) Deploy to Nodejitsu
```
jitsu deploy
```

6) Point your TwiML application's voiceURL at http://yoursubdomain.jit.su/voice

7) Done!


Meta
----
* No warranty expressed or implied.  Software is as is. 
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Built by [Twilio Seattle][15].


[1]: http://twilio.com/client
[2]: http://fantasyfootball.twilio.ly/
[4]: http://expressjs.com/
[5]: http://twitter.github.com/hogan.js/
[6]: http://twilio.com/client
[7]: https://npmjs.org/package/twiliosig
[8]: https://npmjs.org/package/twilio-client-token
[9]: http://www.twilio.com/docs/client/capability-tokens
[10]: http://www.twilio.com/docs/api/twiml
[11]: http://redis.io/
[12]: http://www.twilio.com/try-twilio
[13]: http://nodejitsu.com
[14]: http://redistogo.com
[15]: https://twitter.com/carterrabasa

