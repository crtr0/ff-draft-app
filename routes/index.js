var TwilioCapability = require('twilio-client-token')
  ,	redis = require("redis")
  , twiliosig = require('twiliosig')
  , config = require('../config')
  , client = redis.createClient(config.redis.port, config.redis.url);

client.auth(config.redis.password);
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.room = function(req, res){
  // check to see that the room id is valid
  client.get(req.query.id, function(err, reply) {
  	if (reply) {
  		var tc = new TwilioCapability(config.twilio.sid, config.twilio.key);
  		tc.allowClientOutgoing(config.twilio.app);
  		var token = tc.generate();
  		res.render('room', { token: token , id: req.query.id});
  	}
  	else {
  		res.render('invalid');
  	}
  });
};

exports.voice = function(req, res){
  if (twiliosig.valid(req, config.twilio.key)) {
    res.header('Content-type', 'text/xml'); 
    res.render('voice', { id: req.query.id ? req.query.id : req.query.Digits, digits: req.query.Digits });    
  }
  else {
    res.status(403).send("Forbidden");
  }

};

exports.create = function(req, res){
  var id;
  while (true) {
  	id = Math.floor(Math.random()*9000) + 1000;
  	if (!client.get(id)) {
  		client.set(id, {status: "taken"}, redis.print);
  		break;
  	}
  }
  res.header('Content-type', 'application/JSON'); 
  res.send(JSON.stringify({id: id}));
};

