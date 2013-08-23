
var express = require('express')
  , app = express()
  , cons = require('consolidate')
  , io = require('socket.io').listen(app.listen(process.env.PORT))
  , fs = require('fs'), twitter = require('ntwitter')
  , util = require('util');



app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use(express.static(__dirname + '/'));

var twit = new twitter({
  consumer_key:     process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:  process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Consolidate.js'
  });
});

// Heroku won't actually allow us to use WebSockets
// // so we have to setup polling instead.
// // https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
	socket.on('message', function (message) {
		console.log('location received');
		var loc = message;
		//'-53.525391,-22.762886,-43.472900,-20.363126'
        twit.stream('statuses/filter', {'locations':loc},
			function(stream) {
			  stream.on('data',function(data){
				socket.emit('twitter',data);
			  });
		});   
    });
  
});

