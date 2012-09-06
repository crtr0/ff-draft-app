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

var getUniqueKey = function(callback) {
  var id = Math.floor(Math.random()*9000) + 1000;
  
  client.get(id, function(err, res) {
    if (err) {
      callback(err, null);
    }
    else if (res) {
      getUniqueKey(callback);
    }
    else {
      client.set(id, {status: "taken"}, redis.print);
      callback(null, id);
    }
  });
};

exports.create = function(req, res){
  getUniqueKey(function(err, id) {
    if (err) {
      res.header('Content-type', 'application/JSON'); 
      res.send(JSON.stringify({error: err}));
    }
    else {
      res.header('Content-type', 'application/JSON'); 
      res.send(JSON.stringify({id: id}));      
    }
  });
};

